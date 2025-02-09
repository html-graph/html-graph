import { Options } from "./options";
import { CoreOptions } from "./core-options";
import { createOptions } from "./create-options";
import { resolveEdgeShapeFactory } from "./resolve-edge-shape-factory";
import { EdgeShapeFactory } from "@/edges";
import { GraphStore, PublicGraphStore } from "@/graph-store";
import {
  PublicViewportTransformer,
  ViewportTransformer,
} from "@/viewport-transformer";
import { Canvas } from "../canvas";
import { AddNodeRequest } from "../add-node-request";
import { UpdateNodeRequest } from "../update-node-request";
import { AddEdgeRequest } from "../add-edge-request";
import { UpdateEdgeRequest } from "../update-edge-request";
import { MarkPortRequest } from "../mark-port-request";
import { UpdatePortMarkRequest } from "../update-port-mark-request";
import { PatchMatrixRequest } from "../patch-transform-request";
import { HtmlController } from "@/html-controller";
import { CanvasController } from "@/canvas-controller";

/**
 * Provides low level API for acting on graph
 */
export class CanvasCore implements Canvas {
  public readonly transformation: PublicViewportTransformer;

  public readonly model: PublicGraphStore;

  private readonly canvasController: CanvasController;

  private readonly edgeShapeFactory: EdgeShapeFactory;

  public constructor(private readonly apiOptions?: CoreOptions) {
    const options: Options = createOptions(this.apiOptions);

    const viewportTransformer = new ViewportTransformer();
    const graphStore = new GraphStore();

    this.model = new PublicGraphStore(graphStore);

    this.transformation = new PublicViewportTransformer(viewportTransformer);

    const htmlController = new HtmlController(graphStore, viewportTransformer);

    this.canvasController = new CanvasController(
      graphStore,
      htmlController,
      viewportTransformer,
      options.nodes.centerFn,
      options.ports.centerFn,
      options.ports.direction,
      options.nodes.priorityFn,
      options.edges.priorityFn,
    );

    this.edgeShapeFactory = options.edges.shapeFactory;
  }

  public attach(element: HTMLElement): CanvasCore {
    this.canvasController.attach(element);

    return this;
  }

  public detach(): CanvasCore {
    this.canvasController.detach();

    return this;
  }

  public addNode(request: AddNodeRequest): CanvasCore {
    this.canvasController.addNode({
      nodeId: request.id,
      element: request.element,
      x: request.x,
      y: request.y,
      ports: request.ports,
      centerFn: request.centerFn,
      priority: request.priority,
    });

    return this;
  }

  public updateNode(nodeId: unknown, request?: UpdateNodeRequest): CanvasCore {
    this.canvasController.updateNode(nodeId, {
      x: request?.x,
      y: request?.y,
      priority: request?.priority,
      centerFn: request?.centerFn,
    });

    return this;
  }

  public removeNode(nodeId: unknown): CanvasCore {
    this.canvasController.removeNode(nodeId);

    return this;
  }

  public addEdge(edge: AddEdgeRequest): CanvasCore {
    const shapeFactory =
      edge.shape !== undefined
        ? resolveEdgeShapeFactory(edge.shape)
        : this.edgeShapeFactory;

    this.canvasController.addEdge({
      edgeId: edge.id,
      from: edge.from,
      to: edge.to,
      shapeFactory,
      priority: edge.priority,
    });

    return this;
  }

  public updateEdge(edgeId: unknown, request?: UpdateEdgeRequest): CanvasCore {
    const shapeFactory =
      request?.shape !== undefined
        ? resolveEdgeShapeFactory(request.shape)
        : undefined;

    this.canvasController.updateEdge({
      edgeId,
      shape: shapeFactory,
      priority: request?.priority,
    });

    return this;
  }

  public removeEdge(edgeId: unknown): CanvasCore {
    this.canvasController.removeEdge(edgeId);

    return this;
  }

  public markPort(port: MarkPortRequest): CanvasCore {
    this.canvasController.markPort({
      portId: port.id,
      element: port.element,
      nodeId: port.nodeId,
      centerFn: port.centerFn,
      direction: port.direction,
    });

    return this;
  }

  public updatePort(
    portId: string,
    request?: UpdatePortMarkRequest,
  ): CanvasCore {
    this.canvasController.updatePort(portId, {
      direction: request?.direction,
      centerFn: request?.centerFn,
    });

    return this;
  }

  public unmarkPort(portId: string): CanvasCore {
    this.canvasController.unmarkPort(portId);

    return this;
  }

  public patchViewportMatrix(request: PatchMatrixRequest): CanvasCore {
    this.canvasController.patchViewportMatrix(request);

    return this;
  }

  public patchContentMatrix(request: PatchMatrixRequest): CanvasCore {
    this.canvasController.patchContentMatrix(request);

    return this;
  }

  public clear(): CanvasCore {
    this.canvasController.clear();

    return this;
  }

  public destroy(): void {
    this.clear();
    this.canvasController.destroy();
  }
}
