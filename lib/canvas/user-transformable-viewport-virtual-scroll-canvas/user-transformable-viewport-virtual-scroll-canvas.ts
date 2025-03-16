import { AddNodeRequest } from "../add-node-request";
import { UpdateNodeRequest } from "../update-node-request";
import { AddEdgeRequest } from "../add-edge-request";
import { UpdateEdgeRequest } from "../update-edge-request";
import { MarkPortRequest } from "../mark-port-request";
import { UpdatePortRequest } from "../update-port-request";
import { PatchMatrixRequest } from "../patch-matrix-request";
import { Graph } from "@/graph";
import { TransformState, Viewport } from "@/viewport-transformer";
import { Canvas } from "../canvas";
import { EventSubject } from "@/event-subject";
import { RenderingBox } from "@/html-view";
import { VirtualScrollOptions } from "./virtual-scroll-options";
import {
  TransformOptions,
  UserTransformableViewportCanvas,
} from "../user-transformable-viewport-canvas";

export class UserTransformableViewportVirtualScrollCanvas implements Canvas {
  public readonly graph: Graph;

  public readonly model: Graph;

  public readonly viewport: Viewport;

  public readonly transformation: Viewport;

  private readonly canvas: Canvas;

  private element: HTMLElement | null = null;

  private readonly canvasResizeObserver: ResizeObserver;

  private readonly window = window;

  private areaWidth = 0;

  private areaHeight = 0;

  private viewportMatrix: TransformState;

  public constructor(
    canvas: Canvas,
    private readonly trigger: EventSubject<RenderingBox>,
    transformOptions: TransformOptions | undefined,
    private readonly virtualScrollOptions: VirtualScrollOptions,
  ) {
    this.canvasResizeObserver = new this.window.ResizeObserver((entries) => {
      const entry = entries[0];

      this.areaWidth = entry.contentRect.width;
      this.areaHeight = entry.contentRect.height;

      this.loadArea();
    });

    const onTransformFinished =
      transformOptions?.events?.onTransformFinished ?? ((): void => {});

    const onTransformChange =
      transformOptions?.events?.onTransformChange ?? ((): void => {});

    const patchedTransformOptions: TransformOptions = {
      ...transformOptions,
      events: {
        ...transformOptions?.events,
        onTransformChange: () => {
          const viewportMatrix = this.canvas.viewport.getViewportMatrix();

          if (viewportMatrix.scale !== this.viewportMatrix.scale) {
            this.loadArea();
          }

          this.viewportMatrix = viewportMatrix;

          onTransformChange();
        },
        onTransformFinished: () => {
          this.loadArea();
          onTransformFinished();
        },
      },
    };

    this.canvas = new UserTransformableViewportCanvas(
      canvas,
      patchedTransformOptions,
    );

    this.viewportMatrix = this.canvas.viewport.getViewportMatrix();

    this.viewport = this.canvas.viewport;
    this.transformation = this.viewport;
    this.graph = this.canvas.graph;
    this.model = this.graph;
  }

  public attach(element: HTMLElement): Canvas {
    this.detach();

    this.element = element;
    this.canvasResizeObserver.observe(this.element);
    this.canvas.attach(element);

    return this;
  }

  public detach(): Canvas {
    if (this.element !== null) {
      this.canvasResizeObserver.unobserve(this.element);
      this.element = null;
      this.areaWidth = 0;
      this.areaHeight = 0;
    }

    this.canvas.detach();

    return this;
  }

  public addNode(node: AddNodeRequest): Canvas {
    this.canvas.addNode(node);

    return this;
  }

  public updateNode(nodeId: unknown, request?: UpdateNodeRequest): Canvas {
    this.canvas.updateNode(nodeId, request);

    return this;
  }

  public removeNode(nodeId: unknown): Canvas {
    this.canvas.removeNode(nodeId);

    return this;
  }

  public markPort(port: MarkPortRequest): Canvas {
    this.canvas.markPort(port);

    return this;
  }

  public updatePort(portId: string, request?: UpdatePortRequest): Canvas {
    this.canvas.updatePort(portId, request);

    return this;
  }

  public unmarkPort(portId: string): Canvas {
    this.canvas.unmarkPort(portId);

    return this;
  }

  public addEdge(edge: AddEdgeRequest): Canvas {
    this.canvas.addEdge(edge);

    return this;
  }

  public updateEdge(edgeId: unknown, request?: UpdateEdgeRequest): Canvas {
    this.canvas.updateEdge(edgeId, request);

    return this;
  }

  public removeEdge(edgeId: unknown): Canvas {
    this.canvas.removeEdge(edgeId);

    return this;
  }

  public patchViewportMatrix(request: PatchMatrixRequest): Canvas {
    this.canvas.patchViewportMatrix(request);

    return this;
  }

  public patchContentMatrix(request: PatchMatrixRequest): Canvas {
    this.canvas.patchContentMatrix(request);

    return this;
  }

  public clear(): Canvas {
    this.canvas.clear();

    return this;
  }

  public destroy(): void {
    this.canvas.destroy();
  }

  private loadArea(): void {
    const absWidth = this.areaWidth * this.viewportMatrix.scale;
    const absHeight = this.areaHeight * this.viewportMatrix.scale;

    const x =
      this.viewportMatrix.x -
      absWidth -
      this.virtualScrollOptions.horizontalOffset;

    const y =
      this.viewportMatrix.y -
      absHeight -
      this.virtualScrollOptions.verticalOffset;

    const width = 3 * absWidth + 2 * this.virtualScrollOptions.horizontalOffset;

    const height = 3 * absHeight + 2 * this.virtualScrollOptions.verticalOffset;

    this.trigger.emit({ x, y, width, height });
  }
}
