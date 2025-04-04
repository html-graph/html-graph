import { ViewportStore } from "@/viewport-store";
import { HtmlView } from "@/html-view";
import { Graph } from "@/graph";
import { GraphStore } from "@/graph-store";
import { Viewport } from "@/viewport";
import { CanvasController } from "../canvas-controller";
import { AddNodeRequest } from "../add-node-request";
import { UpdateNodeRequest } from "../update-node-request";
import { AddEdgeRequest } from "../add-edge-request";
import { UpdateEdgeRequest } from "../update-edge-request";
import { MarkPortRequest } from "../mark-port-request";
import { UpdatePortRequest } from "../update-port-request";
import { PatchMatrixRequest } from "../patch-matrix-request";

export class CoreCanvasController implements CanvasController {
  public readonly viewport: Viewport;

  public readonly graph: Graph;

  public constructor(
    private readonly graphStore: GraphStore,
    private readonly viewportStore: ViewportStore,
    private readonly htmlView: HtmlView,
  ) {
    this.graph = new Graph(this.graphStore);
    this.viewport = new Viewport(this.viewportStore);
  }

  public attach(element: HTMLElement): void {
    this.htmlView.attach(element);
  }

  public detach(): void {
    this.htmlView.detach();
  }

  public addNode(request: AddNodeRequest): void {
    this.graphStore.addNode(request);
    this.htmlView.attachNode(request.id);
  }

  public updateNode(nodeId: unknown, request: UpdateNodeRequest): void {
    const node = this.graphStore.getNode(nodeId)!;

    node.x = request?.x ?? node.x;
    node.y = request?.y ?? node.y;
    node.centerFn = request.centerFn ?? node.centerFn;

    this.htmlView.updateNodeCoordinates(nodeId);
    const edgeIds = this.graphStore.getNodeAdjacentEdgeIds(nodeId);

    edgeIds.forEach((edge) => {
      this.htmlView.renderEdge(edge);
    });

    if (request.priority !== undefined) {
      node.priority = request.priority;
      this.htmlView.updateNodePriority(nodeId);
    }
  }

  public removeNode(nodeId: unknown): void {
    this.graphStore.getNodePortIds(nodeId)!.forEach((portId) => {
      this.unmarkPort(portId);
    });

    this.graphStore.removeNode(nodeId);
    this.htmlView.detachNode(nodeId);
  }

  public markPort(request: MarkPortRequest): void {
    this.graphStore.addPort(request);
  }

  public updatePort(portId: unknown, request: UpdatePortRequest): void {
    const port = this.graphStore.getPort(portId)!;

    port.direction = request.direction ?? port.direction;

    const edgeIds = this.graphStore.getPortAdjacentEdgeIds(portId);

    edgeIds.forEach((edge) => {
      this.htmlView.renderEdge(edge);
    });
  }

  public unmarkPort(portId: unknown): void {
    this.graphStore.getPortAdjacentEdgeIds(portId).forEach((edgeId) => {
      this.removeEdge(edgeId);
    });

    this.graphStore.removePort(portId);
  }

  public addEdge(request: AddEdgeRequest): void {
    this.graphStore.addEdge(request);
    this.htmlView.attachEdge(request.id);
  }

  public updateEdge(edgeId: unknown, request: UpdateEdgeRequest): void {
    const edge = this.graphStore.getEdge(edgeId)!;

    if (request.shape !== undefined) {
      edge.shape = request.shape;
      this.htmlView.updateEdgeShape(edgeId);
    }

    if (request.from !== undefined) {
      this.graphStore.updateEdgeFrom(edgeId, request.from);
    }

    if (request.to !== undefined) {
      this.graphStore.updateEdgeTo(edgeId, request.to);
    }

    this.htmlView.renderEdge(edgeId);

    if (request.priority !== undefined) {
      edge.priority = request.priority;
      this.htmlView.updateEdgePriority(edgeId);
    }
  }

  public removeEdge(edgeId: unknown): void {
    this.graphStore.removeEdge(edgeId);
    this.htmlView.detachEdge(edgeId);
  }

  public patchViewportMatrix(request: PatchMatrixRequest): void {
    this.viewportStore.patchViewportMatrix(request);
  }

  public patchContentMatrix(request: PatchMatrixRequest): void {
    this.viewportStore.patchContentMatrix(request);
  }

  public clear(): void {
    this.htmlView.clear();
    this.graphStore.clear();
  }

  public destroy(): void {
    this.clear();
    this.htmlView.destroy();
  }
}
