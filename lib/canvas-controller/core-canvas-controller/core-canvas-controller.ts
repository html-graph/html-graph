import { Viewport, ViewportTransformer } from "@/viewport-transformer";
import { CanvasController } from "../canvas-controller";
import { AddNodeRequest } from "../add-node-request";
import { UpdateNodeRequest } from "../update-node-request";
import { AddEdgeRequest } from "../add-edge-request";
import { UpdateEdgeRequest } from "../update-edge-request";
import { MarkPortRequest } from "../mark-port-request";
import { UpdatePortRequest } from "../update-port-request";
import { PatchMatrixRequest } from "../patch-matrix-request";
import { HtmlView } from "@/html-view";
import { GraphStoreController } from "@/graph-store-controller";
import { Graph } from "@/graph";
import { DiContainer } from "./di-container";
import { GraphStore } from "@/graph-store";

/**
 * Provides low level API for acting on graph
 */
export class CoreCanvasController implements CanvasController {
  public readonly viewport: Viewport;

  public readonly graph: Graph;

  private readonly internalTransformation: ViewportTransformer;

  private readonly internalModel: GraphStore;

  private readonly graphStoreController: GraphStoreController;

  private readonly htmlView: HtmlView;

  private readonly onAfterNodeAdded = (nodeId: unknown): void => {
    this.htmlView.attachNode(nodeId);
  };

  private readonly onAfterEdgeAdded = (edgeId: unknown): void => {
    this.htmlView.attachEdge(edgeId);
  };

  private readonly onAfterEdgeShapeUpdated = (edgeId: unknown): void => {
    this.htmlView.updateEdgeShape(edgeId);
  };

  private readonly onAfterEdgePriorityUpdated = (edgeId: unknown): void => {
    this.htmlView.updateEdgePriority(edgeId);
  };

  private readonly onAfterEdgeUpdated = (edgeId: unknown): void => {
    this.htmlView.renderEdge(edgeId);
  };

  private readonly onAfterPortUpdated = (portId: unknown): void => {
    const edges = this.internalModel.getPortAdjacentEdgeIds(portId);

    edges.forEach((edge) => {
      this.htmlView.renderEdge(edge);
    });
  };

  private readonly onAfterNodePriorityUpdated = (nodeId: unknown): void => {
    this.htmlView.updateNodePriority(nodeId);
  };

  private readonly onAfterNodeUpdated = (nodeId: unknown): void => {
    this.htmlView.updateNodeCoordinates(nodeId);
    const edges = this.internalModel.getNodeAdjacentEdgeIds(nodeId);

    edges.forEach((edge) => {
      this.htmlView.renderEdge(edge);
    });
  };

  private readonly onBeforeEdgeRemoved = (edgeId: unknown): void => {
    this.htmlView.detachEdge(edgeId);
  };

  private readonly onBeforeNodeRemoved = (nodeId: unknown): void => {
    this.htmlView.detachNode(nodeId);
  };

  public constructor(di: DiContainer) {
    this.graph = di.graph;
    this.internalModel = di.graphStore;
    this.internalTransformation = di.viewportTransformer;
    this.viewport = di.viewport;
    this.htmlView = di.htmlView;
    this.graphStoreController = di.graphStoreController;

    this.graphStoreController.onAfterNodeAdded.subscribe(this.onAfterNodeAdded);

    this.graphStoreController.onAfterEdgeAdded.subscribe(this.onAfterEdgeAdded);

    this.graphStoreController.onAfterEdgeShapeUpdated.subscribe(
      this.onAfterEdgeShapeUpdated,
    );

    this.graphStoreController.onAfterEdgePriorityUpdated.subscribe(
      this.onAfterEdgePriorityUpdated,
    );

    this.graphStoreController.onAfterEdgeUpdated.subscribe(
      this.onAfterEdgeUpdated,
    );

    this.graphStoreController.onAfterPortUpdated.subscribe(
      this.onAfterPortUpdated,
    );

    this.graphStoreController.onAfterNodePriorityUpdated.subscribe(
      this.onAfterNodePriorityUpdated,
    );

    this.graphStoreController.onAfterNodeUpdated.subscribe(
      this.onAfterNodeUpdated,
    );

    this.graphStoreController.onBeforeEdgeRemoved.subscribe(
      this.onBeforeEdgeRemoved,
    );

    this.graphStoreController.onBeforeNodeRemoved.subscribe(
      this.onBeforeNodeRemoved,
    );
  }

  public attach(element: HTMLElement): void {
    this.htmlView.attach(element);
  }

  public detach(): void {
    this.htmlView.detach();
  }

  public addNode(request: AddNodeRequest): void {
    this.graphStoreController.addNode(request);
  }

  public updateNode(
    nodeId: unknown,
    request: UpdateNodeRequest | undefined,
  ): void {
    this.graphStoreController.updateNode(nodeId, request ?? {});
  }

  public removeNode(nodeId: unknown): void {
    this.graphStoreController.removeNode(nodeId);
  }

  public addEdge(request: AddEdgeRequest): void {
    this.graphStoreController.addEdge(request);
  }

  public updateEdge(
    edgeId: unknown,
    request: UpdateEdgeRequest | undefined,
  ): void {
    this.graphStoreController.updateEdge(edgeId, request ?? {});
  }

  public removeEdge(edgeId: unknown): void {
    this.graphStoreController.removeEdge(edgeId);
  }

  public markPort(request: MarkPortRequest): void {
    this.graphStoreController.markPort(request);
  }

  public updatePort(
    portId: string,
    request: UpdatePortRequest | undefined,
  ): void {
    this.graphStoreController.updatePort(portId, request ?? {});
  }

  public unmarkPort(portId: string): void {
    this.graphStoreController.unmarkPort(portId);
  }

  public patchViewportMatrix(request: PatchMatrixRequest): void {
    this.internalTransformation.patchViewportMatrix(request);
  }

  public patchContentMatrix(request: PatchMatrixRequest): void {
    this.internalTransformation.patchContentMatrix(request);
  }

  public clear(): void {
    this.htmlView.clear();
    this.graphStoreController.clear();
  }

  public destroy(): void {
    this.htmlView.destroy();
    this.graphStoreController.clear();

    this.graphStoreController.onAfterNodeAdded.unsubscribe(
      this.onAfterNodeAdded,
    );

    this.graphStoreController.onAfterEdgeAdded.unsubscribe(
      this.onAfterEdgeAdded,
    );

    this.graphStoreController.onAfterEdgeShapeUpdated.unsubscribe(
      this.onAfterEdgeShapeUpdated,
    );

    this.graphStoreController.onAfterEdgePriorityUpdated.unsubscribe(
      this.onAfterEdgePriorityUpdated,
    );

    this.graphStoreController.onAfterEdgeUpdated.unsubscribe(
      this.onAfterEdgeUpdated,
    );

    this.graphStoreController.onAfterPortUpdated.unsubscribe(
      this.onAfterPortUpdated,
    );

    this.graphStoreController.onAfterNodePriorityUpdated.unsubscribe(
      this.onAfterNodePriorityUpdated,
    );

    this.graphStoreController.onAfterNodeUpdated.unsubscribe(
      this.onAfterNodeUpdated,
    );

    this.graphStoreController.onBeforeEdgeRemoved.unsubscribe(
      this.onBeforeEdgeRemoved,
    );

    this.graphStoreController.onBeforeNodeRemoved.unsubscribe(
      this.onBeforeNodeRemoved,
    );
  }
}
