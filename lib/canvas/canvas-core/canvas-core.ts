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
import { Options } from "./options";
import { CoreOptions } from "./core-options";
import { createOptions } from "./create-options";
import { resolveEdgeShapeFactory } from "./resolve-edge-shape-factory";
import { EdgeShapeFactory } from "@/edges";
import { UpdatePortRequest } from "../canvas/update-port-request";
import { PublicGraphStore } from "@/graph-store";
import { PublicViewportTransformer } from "@/viewport-transformer";
import { IdGenerator } from "@/id-generator";
import { TwoWayMap } from "@/two-way-map";
import { HtmlGraphError } from "@/error";

/**
 * Provides low level API for acting on graph
 */
export class CanvasCore implements Canvas {
  public readonly transformation: PublicViewportTransformer;

  public readonly model: PublicGraphStore;

  private readonly di: DiContainer;

  private readonly edgeShapeFactory: EdgeShapeFactory;

  private readonly nodes = new TwoWayMap<unknown, Element>();

  private readonly nodeIdGenerator = new IdGenerator((nodeId) =>
    this.nodes.hasKey(nodeId),
  );

  private readonly nodesResizeObserver: ResizeObserver;

  public constructor(private readonly apiOptions?: CoreOptions) {
    this.nodesResizeObserver = new window.ResizeObserver((entries) => {
      entries.forEach((entry) => {
        const element = entry.target;
        const nodeId = this.nodes.getByValue(element)!;

        this.updateNode(nodeId);

        const edges = this.model.getNodeAdjacentEdgeIds(nodeId);

        edges.forEach((edge) => {
          this.updateEdge(edge);
        });
      });
    });

    const options: Options = createOptions(this.apiOptions ?? {});

    this.di = new DiContainer({
      nodesCenterFn: options.nodes.centerFn,
      nodesPriorityFn: options.nodes.priorityFn,
      portsCenterFn: options.ports.centerFn,
      portsDirection: options.ports.direction,
      edgesPriorityFn: options.edges.priorityFn,
    });

    this.transformation = this.di.publicViewportTransformer;
    this.model = this.di.publicGraphStore;

    this.edgeShapeFactory = options.edges.shapeFactory;
  }

  public addNode(request: AddNodeRequest): CanvasCore {
    const nodeId = this.nodeIdGenerator.create(request.id);

    this.di.canvasController.addNode({
      nodeId,
      element: request.element,
      x: request.x,
      y: request.y,
      ports: request.ports,
      centerFn: request.centerFn,
      priority: request.priority,
    });

    this.nodes.set(nodeId, request.element);
    this.nodesResizeObserver.observe(request.element);

    return this;
  }

  public updateNode(nodeId: unknown, request?: UpdateNodeRequest): CanvasCore {
    this.di.canvasController.updateNode(nodeId, {
      x: request?.x,
      y: request?.y,
      priority: request?.priority,
      centerFn: request?.centerFn,
    });

    return this;
  }

  public removeNode(nodeId: unknown): CanvasCore {
    this.di.canvasController.removeNode(nodeId);

    const element = this.nodes.getByKey(nodeId);

    this.nodes.deleteByKey(nodeId);

    if (element === undefined) {
      throw new HtmlGraphError("failed to remove non existing node");
    }

    this.nodesResizeObserver.unobserve(element);

    return this;
  }

  public markPort(port: MarkPortRequest): CanvasCore {
    this.di.canvasController.markPort({
      portId: port.id,
      element: port.element,
      nodeId: port.nodeId,
      centerFn: port.centerFn,
      direction: port.direction,
    });

    return this;
  }

  public updatePort(portId: string, request?: UpdatePortRequest): CanvasCore {
    this.di.canvasController.updatePort(portId, {
      direction: request?.direction,
      centerFn: request?.centerFn,
    });

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

    this.di.canvasController.addEdge({
      edgeId: edge.id,
      fromPortId: edge.from,
      toPortId: edge.to,
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

    this.di.canvasController.updateEdge({
      edgeId,
      shape: shapeFactory,
      priority: request?.priority,
    });

    return this;
  }

  public removeEdge(edgeId: unknown): CanvasCore {
    this.di.canvasController.removeEdge(edgeId);

    return this;
  }

  public patchViewportMatrix(request: PatchMatrixRequest): CanvasCore {
    this.di.canvasController.patchViewportMatrix(request);

    return this;
  }

  public patchContentMatrix(request: PatchMatrixRequest): CanvasCore {
    this.di.canvasController.patchContentMatrix(request);

    return this;
  }

  public clear(): CanvasCore {
    this.di.canvasController.clear();
    this.nodes.clear();

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
    this.clear();
    this.di.canvasController.destroy();
    this.nodesResizeObserver.disconnect();
  }
}
