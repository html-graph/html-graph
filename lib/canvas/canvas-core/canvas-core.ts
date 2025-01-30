import { DiContainer } from "@/di-container";
import {
  AddEdgeRequest,
  AddNodeRequest,
  MarkPortRequest,
  PatchMatrixRequest,
  Canvas,
  UpdateEdgeRequest,
  UpdateNodeRequest,
} from "../canvas";
import { AbstractPublicViewportTransformer } from "@/viewport-transformer";
import { Options } from "./options";
import { CoreOptions } from "./core-options";
import { createOptions } from "./create-options";
import { resolveEdgeShapeFactory } from "./resolve-edge-shape-factory";
import { EdgeShapeFactory } from "@/edges";
import { UpdatePortRequest } from "../canvas/update-port-request";
import { AbstractPublicGraphStore } from "@/graph-store";

/**
 * Provides low level API for acting on graph
 */
export class CanvasCore implements Canvas {
  public readonly transformation: AbstractPublicViewportTransformer;

  public readonly model: AbstractPublicGraphStore;

  private readonly di: DiContainer;

  private readonly edgeShapeFactory: EdgeShapeFactory;

  private readonly nodeResizeObserverFactory = (
    callback: ResizeObserverCallback,
  ): ResizeObserver => new window.ResizeObserver(callback);

  public constructor(private readonly apiOptions?: CoreOptions) {
    const options: Options = createOptions(this.apiOptions ?? {});

    const getBoundingClientRect = (element: HTMLElement) => {
      return element.getBoundingClientRect();
    };

    this.di = new DiContainer(
      this.nodeResizeObserverFactory,
      getBoundingClientRect,
      options.nodes.centerFn,
      options.ports.centerFn,
      options.ports.direction,
      options.nodes.priorityFn,
      options.edges.priorityFn,
    );

    this.transformation = this.di.publicViewportTransformer;
    this.model = this.di.publicGraphStore;

    this.edgeShapeFactory = options.edges.shapeFactory;
  }

  public addNode(node: AddNodeRequest): CanvasCore {
    this.di.canvasController.addNode(
      node.id,
      node.element,
      node.x,
      node.y,
      node.ports,
      node.centerFn,
      node.priority,
    );

    return this;
  }

  public updateNode(nodeId: unknown, request: UpdateNodeRequest): CanvasCore {
    this.di.canvasController.updateNode(
      nodeId,
      request.x,
      request.y,
      request.priority,
      request.centerFn,
    );

    return this;
  }

  public removeNode(nodeId: unknown): CanvasCore {
    this.di.canvasController.removeNode(nodeId);

    return this;
  }

  public markPort(port: MarkPortRequest): CanvasCore {
    this.di.canvasController.markPort(
      port.id,
      port.element,
      port.nodeId,
      port.centerFn,
      port.direction,
    );

    return this;
  }

  public updatePort(portId: string, request?: UpdatePortRequest): CanvasCore {
    this.di.canvasController.updatePort(
      portId,
      request?.direction,
      request?.centerFn,
    );

    return this;
  }

  public unmarkPort(portId: string): CanvasCore {
    this.di.canvasController.unmarkPort(portId);

    return this;
  }

  public addEdge(edge: AddEdgeRequest): CanvasCore {
    const shapeFactory =
      edge.shape !== undefined
        ? resolveEdgeShapeFactory(edge.shape)
        : this.edgeShapeFactory;

    this.di.canvasController.addEdge(
      edge.id,
      edge.from,
      edge.to,
      shapeFactory,
      edge.priority,
    );

    return this;
  }

  public updateEdge(edgeId: unknown, request: UpdateEdgeRequest): CanvasCore {
    const shapeFactory =
      request.shape !== undefined
        ? resolveEdgeShapeFactory(request.shape)
        : undefined;

    this.di.canvasController.updateEdge(edgeId, shapeFactory, request.priority);

    return this;
  }

  public removeEdge(edgeId: unknown): CanvasCore {
    this.di.canvasController.removeEdge(edgeId);

    return this;
  }

  public patchViewportMatrix(request: PatchMatrixRequest): CanvasCore {
    this.di.canvasController.patchViewportMatrix(
      request.scale ?? null,
      request.dx ?? null,
      request.dy ?? null,
    );

    return this;
  }

  public patchContentMatrix(request: PatchMatrixRequest): CanvasCore {
    this.di.canvasController.patchContentMatrix(
      request.scale ?? null,
      request.dx ?? null,
      request.dy ?? null,
    );

    return this;
  }

  public clear(): CanvasCore {
    this.di.canvasController.clear();

    return this;
  }

  public attach(element: HTMLElement): CanvasCore {
    this.di.canvasController.attach(element);

    return this;
  }

  public detach(): CanvasCore {
    this.di.canvasController.detach();

    return this;
  }

  public destroy(): void {
    this.di.canvasController.destroy();
  }
}
