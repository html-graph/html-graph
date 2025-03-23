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

  public attach(element: HTMLElement): CanvasController {
    this.htmlView.attach(element);

    return this;
  }

  public detach(): CanvasController {
    this.htmlView.detach();

    return this;
  }

  public addNode(request: AddNodeRequest): CanvasController {
    this.graphStoreController.addNode(request);

    return this;
  }

  public updateNode(
    nodeId: unknown,
    request?: UpdateNodeRequest,
  ): CanvasController {
    this.graphStoreController.updateNode(nodeId, request ?? {});

    return this;
  }

  public removeNode(nodeId: unknown): CanvasController {
    this.graphStoreController.removeNode(nodeId);

    return this;
  }

  public addEdge(request: AddEdgeRequest): CanvasController {
    this.graphStoreController.addEdge(request);

    return this;
  }

  public updateEdge(
    edgeId: unknown,
    request?: UpdateEdgeRequest,
  ): CanvasController {
    this.graphStoreController.updateEdge(edgeId, request ?? {});

    return this;
  }

  public removeEdge(edgeId: unknown): CanvasController {
    this.graphStoreController.removeEdge(edgeId);

    return this;
  }

  public markPort(request: MarkPortRequest): CanvasController {
    this.graphStoreController.markPort(request);

    return this;
  }

  public updatePort(
    portId: string,
    request?: UpdatePortRequest,
  ): CanvasController {
    this.graphStoreController.updatePort(portId, request ?? {});

    return this;
  }

  public unmarkPort(portId: string): CanvasController {
    this.graphStoreController.unmarkPort(portId);

    return this;
  }

  public patchViewportMatrix(request: PatchMatrixRequest): CanvasController {
    this.internalTransformation.patchViewportMatrix(request);

    return this;
  }

  public patchContentMatrix(request: PatchMatrixRequest): CanvasController {
    this.internalTransformation.patchContentMatrix(request);

    return this;
  }

  public clear(): CanvasController {
    this.htmlView.clear();
    this.graphStoreController.clear();

    return this;
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
