import { DiContainer } from "@/di-container";
import {
  AddEdgeRequest,
  AddNodeRequest,
  MarkPortRequest,
  PatchViewportRequest,
  Canvas,
  UpdateEdgeRequest,
  UpdateNodeRequest,
} from "../canvas";
import { PublicViewportTransformer } from "@/viewport-transformer";
import { Options } from "./options";
import { CoreOptions } from "./core-options";
import { createOptions } from "./create-options";
import { resolveEdgeControllerFactory } from "./resolve-edge-controller-factory";
import { EdgeControllerFactory } from "@/edges";
import { UpdatePortRequest } from "../canvas/update-port-request";
import { PublicGraphStore } from "@/graph-store";

/**
 * Provides low level API for acting on graph
 */
export class CanvasCore implements Canvas {
  public readonly transformation: PublicViewportTransformer;

  public readonly model: PublicGraphStore;

  private readonly di: DiContainer;

  private readonly edgeControllerFactory: EdgeControllerFactory;

  public constructor(private readonly apiOptions?: CoreOptions) {
    const options: Options = createOptions(this.apiOptions ?? {});

    this.di = new DiContainer(
      options.background.drawingFn,
      options.nodes.centerFn,
      options.ports.centerFn,
      options.ports.direction,
    );

    this.transformation = this.di.publicViewportTransformer;
    this.model = this.di.publicGraphStore;

    this.edgeControllerFactory = options.edges.controllerFactory;
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

  public updatePort(portId: string, request: UpdatePortRequest): CanvasCore {
    this.di.canvasController.updatePort(portId, request);

    return this;
  }

  public unmarkPort(portId: string): CanvasCore {
    this.di.canvasController.unmarkPort(portId);

    return this;
  }

  public addEdge(edge: AddEdgeRequest): CanvasCore {
    const controllerFactory =
      edge.options !== undefined
        ? resolveEdgeControllerFactory(edge.options)
        : this.edgeControllerFactory;

    this.di.canvasController.addEdge(
      edge.id,
      edge.from,
      edge.to,
      controllerFactory,
      edge.priority,
    );

    return this;
  }

  public updateEdge(edgeId: unknown, request: UpdateEdgeRequest): CanvasCore {
    this.di.canvasController.updateEdge(edgeId, request);

    return this;
  }

  public removeEdge(edgeId: unknown): CanvasCore {
    this.di.canvasController.removeEdge(edgeId);

    return this;
  }

  public patchViewportState(request: PatchViewportRequest): CanvasCore {
    this.di.canvasController.patchViewportState(
      request.scale ?? null,
      request.x ?? null,
      request.y ?? null,
    );

    return this;
  }

  public moveToNodes(nodeIds: readonly string[]): CanvasCore {
    this.di.canvasController.moveToNodes(nodeIds);

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
