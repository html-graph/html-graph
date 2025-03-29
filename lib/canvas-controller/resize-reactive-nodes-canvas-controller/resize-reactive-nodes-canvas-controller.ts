import { Viewport } from "@/viewport-transformer";
import { AddNodeRequest } from "../add-node-request";
import { UpdateNodeRequest } from "../update-node-request";
import { AddEdgeRequest } from "../add-edge-request";
import { UpdateEdgeRequest } from "../update-edge-request";
import { MarkPortRequest } from "../mark-port-request";
import { UpdatePortRequest } from "../update-port-request";
import { PatchMatrixRequest } from "../patch-matrix-request";
import { TwoWayMap } from "./two-way-map";
import { Graph } from "@/graph";
import { CanvasController } from "../canvas-controller";

export class ResizeReactiveNodesCanvasController implements CanvasController {
  public readonly viewport: Viewport;

  public readonly graph: Graph;

  private readonly nodes = new TwoWayMap<unknown, Element>();

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

  public attach(element: HTMLElement): void {
    this.canvas.attach(element);
  }

  public detach(): void {
    this.canvas.detach();
  }

  public addNode(request: AddNodeRequest): void {
    this.canvas.addNode(request);

    this.nodes.set(request.id, request.element);
    this.nodesResizeObserver.observe(request.element);
  }

  public updateNode(nodeId: unknown, request: UpdateNodeRequest): void {
    this.canvas.updateNode(nodeId, request);
  }

  public removeNode(nodeId: unknown): void {
    this.canvas.removeNode(nodeId);

    const element = this.nodes.getByKey(nodeId);
    this.nodes.deleteByKey(nodeId);

    this.nodesResizeObserver.unobserve(element!);
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
  }

  public patchContentMatrix(request: PatchMatrixRequest): void {
    this.canvas.patchContentMatrix(request);
  }

  public clear(): void {
    this.canvas.clear();

    this.nodesResizeObserver.disconnect();
    this.nodes.clear();
  }

  public destroy(): void {
    this.clear();
    this.canvas.destroy();
  }

  private handleNodeResize(element: HTMLElement): void {
    const nodeId = this.nodes.getByValue(element)!;

    this.canvas.updateNode(nodeId, {});

    const edges = this.graph.getNodeAdjacentEdgeIds(nodeId)!;

    edges.forEach((edge) => {
      this.canvas.updateEdge(edge, {});
    });
  }
}
