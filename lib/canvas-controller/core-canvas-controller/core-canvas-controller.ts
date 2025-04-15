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

  private readonly onAfterNodeAdded = (nodeId: unknown): void => {
    this.htmlView.attachNode(nodeId);
  };

  private readonly onAfterNodeUpdated = (nodeId: unknown): void => {
    this.htmlView.updateNodePosition(nodeId);

    const edgeIds = this.graphStore.getNodeAdjacentEdgeIds(nodeId);

    edgeIds.forEach((edge) => {
      this.htmlView.renderEdge(edge);
    });
  };

  private readonly onAfterNodePriorityUpdated = (nodeId: unknown): void => {
    this.htmlView.updateNodePriority(nodeId);
  };

  private readonly onBeforeNodeRemoved = (nodeId: unknown): void => {
    this.graphStore.getNodePortIds(nodeId)!.forEach((portId) => {
      this.unmarkPort(portId);
    });

    this.htmlView.detachNode(nodeId);
  };

  private readonly onAfterPortUpdated = (portId: unknown): void => {
    const edgeIds = this.graphStore.getPortAdjacentEdgeIds(portId);

    edgeIds.forEach((edge) => {
      this.htmlView.renderEdge(edge);
    });
  };

  private readonly onBeforePortUnmarked = (portId: unknown): void => {
    this.graphStore.getPortAdjacentEdgeIds(portId).forEach((edgeId) => {
      this.removeEdge(edgeId);
    });
  };

  private readonly onAfterEdgeAdded = (edgeId: unknown): void => {
    this.htmlView.attachEdge(edgeId);
  };

  private readonly onAfterEdgeShapeUpdated = (edgeId: unknown): void => {
    this.htmlView.updateEdgeShape(edgeId);
  };

  private readonly onAfterEdgeUpdated = (edgeId: unknown): void => {
    this.htmlView.renderEdge(edgeId);
  };

  private readonly onAfterEdgePriorityUpdated = (edgeId: unknown): void => {
    this.htmlView.updateEdgePriority(edgeId);
  };

  private readonly onBeforeEdgeRemoved = (edgeId: unknown): void => {
    this.htmlView.detachEdge(edgeId);
  };

  private readonly onBeforeClear = (): void => {
    this.htmlView.clear();
  };

  public constructor(
    private readonly graphStore: GraphStore,
    private readonly viewportStore: ViewportStore,
    private readonly htmlView: HtmlView,
  ) {
    this.graphStore.onAfterNodeAdded.subscribe(this.onAfterNodeAdded);

    this.graphStore.onAfterNodeUpdated.subscribe(this.onAfterNodeUpdated);

    this.graphStore.onAfterNodePriorityUpdated.subscribe(
      this.onAfterNodePriorityUpdated,
    );

    this.graphStore.onBeforeNodeRemoved.subscribe(this.onBeforeNodeRemoved);

    this.graphStore.onAfterPortUpdated.subscribe(this.onAfterPortUpdated);

    this.graphStore.onBeforePortRemoved.subscribe(this.onBeforePortUnmarked);

    this.graphStore.onAfterEdgeAdded.subscribe(this.onAfterEdgeAdded);

    this.graphStore.onAfterEdgeShapeUpdated.subscribe(
      this.onAfterEdgeShapeUpdated,
    );

    this.graphStore.onAfterEdgeUpdated.subscribe(this.onAfterEdgeUpdated);

    this.graphStore.onAfterEdgePriorityUpdated.subscribe(
      this.onAfterEdgePriorityUpdated,
    );

    this.graphStore.onBeforeEdgeRemoved.subscribe(this.onBeforeEdgeRemoved);

    this.graphStore.onBeforeClear.subscribe(this.onBeforeClear);

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
  }

  public updateNode(nodeId: unknown, request: UpdateNodeRequest): void {
    this.graphStore.updateNode(nodeId, request);
  }

  public removeNode(nodeId: unknown): void {
    this.graphStore.removeNode(nodeId);
  }

  public markPort(request: MarkPortRequest): void {
    this.graphStore.addPort(request);
  }

  public updatePort(portId: unknown, request: UpdatePortRequest): void {
    this.graphStore.updatePort(portId, request);
  }

  public unmarkPort(portId: unknown): void {
    this.graphStore.removePort(portId);
  }

  public addEdge(request: AddEdgeRequest): void {
    this.graphStore.addEdge(request);
  }

  public updateEdge(edgeId: unknown, request: UpdateEdgeRequest): void {
    this.graphStore.updateEdge(edgeId, request);
  }

  public removeEdge(edgeId: unknown): void {
    this.graphStore.removeEdge(edgeId);
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
    this.graphStore.onAfterNodeAdded.unsubscribe(this.onAfterNodeAdded);

    this.graphStore.onAfterNodeUpdated.unsubscribe(this.onAfterNodeUpdated);

    this.graphStore.onAfterNodePriorityUpdated.unsubscribe(
      this.onAfterNodePriorityUpdated,
    );

    this.graphStore.onBeforeNodeRemoved.unsubscribe(this.onBeforeNodeRemoved);

    this.graphStore.onAfterPortUpdated.unsubscribe(this.onAfterPortUpdated);

    this.graphStore.onBeforePortRemoved.unsubscribe(this.onBeforePortUnmarked);

    this.graphStore.onAfterEdgeAdded.unsubscribe(this.onAfterEdgeAdded);

    this.graphStore.onAfterEdgeShapeUpdated.unsubscribe(
      this.onAfterEdgeShapeUpdated,
    );

    this.graphStore.onAfterEdgeUpdated.unsubscribe(this.onAfterEdgeUpdated);

    this.graphStore.onAfterEdgePriorityUpdated.unsubscribe(
      this.onAfterEdgePriorityUpdated,
    );

    this.graphStore.onBeforeEdgeRemoved.unsubscribe(this.onBeforeEdgeRemoved);

    this.graphStore.onBeforeClear.unsubscribe(this.onBeforeClear);

    this.clear();
    this.htmlView.destroy();
  }
}
