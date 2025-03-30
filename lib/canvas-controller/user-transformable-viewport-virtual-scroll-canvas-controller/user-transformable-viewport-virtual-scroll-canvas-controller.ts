import { AddNodeRequest } from "../add-node-request";
import { UpdateNodeRequest } from "../update-node-request";
import { AddEdgeRequest } from "../add-edge-request";
import { UpdateEdgeRequest } from "../update-edge-request";
import { MarkPortRequest } from "../mark-port-request";
import { UpdatePortRequest } from "../update-port-request";
import { PatchMatrixRequest } from "../patch-matrix-request";
import { Graph } from "@/graph";
import { TransformState } from "@/viewport-transformer";
import { CanvasController } from "../canvas-controller";
import { EventSubject } from "@/event-subject";
import { RenderingBox } from "@/html-view";
import { VirtualScrollOptions } from "./virtual-scroll-options";
import {
  TransformOptions,
  UserTransformableViewportCanvasController,
} from "../user-transformable-viewport-canvas-controller";
import { Viewport } from "@/viewport";

export class UserTransformableViewportVirtualScrollCanvasController
  implements CanvasController
{
  public readonly graph: Graph;

  public readonly viewport: Viewport;

  private readonly canvas: CanvasController;

  private element: HTMLElement | null = null;

  private readonly canvasResizeObserver: ResizeObserver;

  private readonly window = window;

  private readonly nodeHorizontal: number;

  private readonly nodeVertical: number;

  private viewportWidth = 0;

  private viewportHeight = 0;

  private viewportMatrix: TransformState;

  private loadedArea: {
    readonly xFrom: number;
    readonly xTo: number;
    readonly yFrom: number;
    readonly yTo: number;
  } = {
    xFrom: Infinity,
    xTo: Infinity,
    yFrom: Infinity,
    yTo: Infinity,
  };

  private readonly updateLoadedArea = (renderingBox: RenderingBox): void => {
    this.loadedArea = {
      xFrom: renderingBox.x,
      xTo: renderingBox.x + renderingBox.width,
      yFrom: renderingBox.y,
      yTo: renderingBox.y + renderingBox.height,
    };
  };

  public constructor(
    canvas: CanvasController,
    private readonly trigger: EventSubject<RenderingBox>,
    transformOptions: TransformOptions | undefined,
    private readonly virtualScrollOptions: VirtualScrollOptions,
  ) {
    this.nodeHorizontal =
      this.virtualScrollOptions.nodeContainingRadius.horizontal;
    this.nodeVertical = this.virtualScrollOptions.nodeContainingRadius.vertical;

    this.canvasResizeObserver = new this.window.ResizeObserver((entries) => {
      const entry = entries[0];

      this.viewportWidth = entry.contentRect.width;
      this.viewportHeight = entry.contentRect.height;

      this.scheduleLoadAreaAroundViewport();
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
          const viewportMatrix = this.viewportMatrix;
          this.viewportMatrix = this.canvas.viewport.getViewportMatrix();

          if (viewportMatrix.scale !== this.viewportMatrix.scale) {
            this.scheduleEnsureViewportAreaLoaded();
          }

          onTransformChange();
        },
        onTransformFinished: () => {
          this.scheduleLoadAreaAroundViewport();
          onTransformFinished();
        },
      },
    };

    this.canvas = new UserTransformableViewportCanvasController(
      canvas,
      patchedTransformOptions,
    );

    this.viewportMatrix = this.canvas.viewport.getViewportMatrix();

    this.viewport = this.canvas.viewport;
    this.graph = this.canvas.graph;

    this.trigger.subscribe(this.updateLoadedArea);
  }

  public attach(element: HTMLElement): void {
    this.detach();

    this.element = element;
    this.canvasResizeObserver.observe(this.element);
    this.canvas.attach(element);
  }

  public detach(): void {
    if (this.element !== null) {
      this.canvasResizeObserver.unobserve(this.element);
      this.element = null;
      this.viewportWidth = 0;
      this.viewportHeight = 0;
    }

    this.canvas.detach();
  }

  public addNode(node: AddNodeRequest): void {
    this.canvas.addNode(node);
  }

  public updateNode(nodeId: unknown, request: UpdateNodeRequest): void {
    this.canvas.updateNode(nodeId, request);
  }

  public removeNode(nodeId: unknown): void {
    this.canvas.removeNode(nodeId);
  }

  public markPort(port: MarkPortRequest): void {
    this.canvas.markPort(port);
  }

  public updatePort(portId: unknown, request: UpdatePortRequest): void {
    this.canvas.updatePort(portId, request);
  }

  public unmarkPort(portId: unknown): void {
    this.canvas.unmarkPort(portId);
  }

  public addEdge(edge: AddEdgeRequest): void {
    this.canvas.addEdge(edge);
  }

  public updateEdge(edgeId: unknown, request: UpdateEdgeRequest): void {
    this.canvas.updateEdge(edgeId, request);
  }

  public removeEdge(edgeId: unknown): void {
    this.canvas.removeEdge(edgeId);
  }

  public patchViewportMatrix(request: PatchMatrixRequest): void {
    this.canvas.patchViewportMatrix(request);
    this.viewportMatrix = this.canvas.viewport.getViewportMatrix();
    this.loadAreaAroundViewport();
  }

  public patchContentMatrix(request: PatchMatrixRequest): void {
    this.canvas.patchContentMatrix(request);
    this.viewportMatrix = this.canvas.viewport.getViewportMatrix();
    this.loadAreaAroundViewport();
  }

  public clear(): void {
    this.canvas.clear();
  }

  public destroy(): void {
    this.trigger.unsubscribe(this.updateLoadedArea);
    this.canvas.destroy();
  }

  private scheduleLoadAreaAroundViewport(): void {
    setTimeout(() => {
      this.loadAreaAroundViewport();
    });
  }

  private scheduleEnsureViewportAreaLoaded(): void {
    const absoluteViewportWidth =
      this.viewportWidth * this.viewportMatrix.scale;
    const absoluteViewportHeight =
      this.viewportHeight * this.viewportMatrix.scale;

    const xViewportFrom = this.viewportMatrix.x - this.nodeHorizontal;
    const yViewportFrom = this.viewportMatrix.y - this.nodeVertical;
    const xViewportTo =
      this.viewportMatrix.x + absoluteViewportWidth + this.nodeHorizontal;
    const yViewportTo =
      this.viewportMatrix.y + absoluteViewportHeight + this.nodeVertical;

    const isLoaded =
      this.loadedArea.xFrom < xViewportFrom &&
      this.loadedArea.xTo > xViewportTo &&
      this.loadedArea.yFrom < yViewportFrom &&
      this.loadedArea.yTo > yViewportTo;

    if (!isLoaded) {
      this.scheduleLoadAreaAroundViewport();
    }
  }

  private loadAreaAroundViewport(): void {
    const absoluteViewportWidth =
      this.viewportWidth * this.viewportMatrix.scale;
    const absoluteViewportHeight =
      this.viewportHeight * this.viewportMatrix.scale;

    const x =
      this.viewportMatrix.x - absoluteViewportWidth - this.nodeHorizontal;

    const y =
      this.viewportMatrix.y - absoluteViewportHeight - this.nodeVertical;

    const width = 3 * absoluteViewportWidth + 2 * this.nodeHorizontal;

    const height = 3 * absoluteViewportHeight + 2 * this.nodeVertical;

    this.trigger.emit({ x, y, width, height });
  }
}
