import { Viewport } from "@/viewport-transformer";
import { AddNodeRequest } from "../add-node-request";
import { UpdateNodeRequest } from "../update-node-request";
import { AddEdgeRequest } from "../add-edge-request";
import { UpdateEdgeRequest } from "../update-edge-request";
import { MarkPortRequest } from "../mark-port-request";
import { UpdatePortRequest } from "../update-port-request";
import { PatchMatrixRequest } from "../patch-matrix-request";
import { IdGenerator } from "@/id-generator";
import { TwoWayMap } from "./two-way-map";
import { Graph } from "@/graph";
import { CanvasController } from "../canvas-controller";

export class ResizeReactiveNodesCanvasController implements CanvasController {
  public readonly viewport: Viewport;

  public readonly graph: Graph;

  private readonly nodes = new TwoWayMap<unknown, Element>();

  private readonly nodeIdGenerator = new IdGenerator((nodeId) =>
    this.nodes.hasKey(nodeId),
  );

  private readonly nodesResizeObserver: ResizeObserver;

  private readonly window = window;

  public constructor(private readonly canvas: CanvasController) {
    this.nodesResizeObserver = new this.window.ResizeObserver((entries) => {
      entries.forEach((entry) => {
        const element = entry.target as HTMLElement;

        this.handleNodeResize(element);
      });
    });

    this.viewport = this.canvas.viewport;
    this.graph = this.canvas.graph;
  }

  public attach(element: HTMLElement): CanvasController {
    this.canvas.attach(element);

    return this;
  }

  public detach(): CanvasController {
    this.canvas.detach();

    return this;
  }

  public addNode(request: AddNodeRequest): CanvasController {
    const id = this.nodeIdGenerator.create(request.id);

    this.canvas.addNode({
      ...request,
      id,
    });

    this.nodes.set(id, request.element);
    this.nodesResizeObserver.observe(request.element);

    return this;
  }

  public updateNode(
    nodeId: unknown,
    request?: UpdateNodeRequest,
  ): CanvasController {
    this.canvas.updateNode(nodeId, request);

    return this;
  }

  public removeNode(nodeId: unknown): CanvasController {
    this.canvas.removeNode(nodeId);

    const element = this.nodes.getByKey(nodeId);
    this.nodes.deleteByKey(nodeId);

    this.nodesResizeObserver.unobserve(element!);

    return this;
  }

  public markPort(port: MarkPortRequest): CanvasController {
    this.canvas.markPort(port);

    return this;
  }

  public updatePort(
    portId: string,
    request?: UpdatePortRequest,
  ): CanvasController {
    this.canvas.updatePort(portId, request);

    return this;
  }

  public unmarkPort(portId: string): CanvasController {
    this.canvas.unmarkPort(portId);

    return this;
  }

  public addEdge(edge: AddEdgeRequest): CanvasController {
    this.canvas.addEdge(edge);

    return this;
  }

  public updateEdge(
    edgeId: unknown,
    request?: UpdateEdgeRequest,
  ): CanvasController {
    this.canvas.updateEdge(edgeId, request);

    return this;
  }

  public removeEdge(edgeId: unknown): CanvasController {
    this.canvas.removeEdge(edgeId);

    return this;
  }

  public patchViewportMatrix(request: PatchMatrixRequest): CanvasController {
    this.canvas.patchViewportMatrix(request);

    return this;
  }

  public patchContentMatrix(request: PatchMatrixRequest): CanvasController {
    this.canvas.patchContentMatrix(request);

    return this;
  }

  public clear(): CanvasController {
    this.canvas.clear();

    this.nodesResizeObserver.disconnect();
    this.nodes.clear();

    return this;
  }

  public destroy(): void {
    this.clear();
    this.canvas.destroy();
  }

  private handleNodeResize(element: HTMLElement): void {
    const nodeId = this.nodes.getByValue(element)!;

    this.canvas.updateNode(nodeId);

    const edges = this.graph.getNodeAdjacentEdgeIds(nodeId)!;

    edges.forEach((edge) => {
      this.canvas.updateEdge(edge);
    });
  }
}
