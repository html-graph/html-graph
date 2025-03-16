import { CoreOptions, createOptions } from "./options";
import { GraphStore } from "@/graph-store";
import { Viewport, ViewportTransformer } from "@/viewport-transformer";
import { Canvas } from "../canvas";
import { AddNodeRequest } from "../add-node-request";
import { UpdateNodeRequest } from "../update-node-request";
import { AddEdgeRequest } from "../add-edge-request";
import { UpdateEdgeRequest } from "../update-edge-request";
import { MarkPortRequest } from "../mark-port-request";
import { UpdatePortRequest } from "../update-port-request";
import { PatchMatrixRequest } from "../patch-matrix-request";
import { CoreHtmlView } from "@/html-view";
import { GraphStoreController } from "@/graph-store-controller";
import { Graph } from "@/graph";

/**
 * @deprecated
 */
export class CanvasCore implements Canvas {
  public readonly viewport: Viewport;

  public readonly transformation: Viewport;

  public readonly graph: Graph;

  public readonly model: Graph;

  private readonly internalTransformation: ViewportTransformer;

  private readonly internalModel: GraphStore;

  private readonly graphStoreController: GraphStoreController;

  private readonly htmlView: CoreHtmlView;

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

  public constructor(apiOptions?: CoreOptions) {
    this.internalModel = new GraphStore();
    this.graph = new Graph(this.internalModel);
    this.model = this.graph;
    this.internalTransformation = new ViewportTransformer();

    this.viewport = new Viewport(this.internalTransformation);
    this.transformation = this.viewport;

    this.htmlView = new CoreHtmlView(
      this.internalModel,
      this.internalTransformation,
    );

    this.graphStoreController = new GraphStoreController(
      this.internalModel,
      createOptions(apiOptions),
    );

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

  public attach(element: HTMLElement): CanvasCore {
    this.htmlView.attach(element);

    return this;
  }

  public detach(): CanvasCore {
    this.htmlView.detach();

    return this;
  }

  public addNode(request: AddNodeRequest): CanvasCore {
    this.graphStoreController.addNode(request);

    return this;
  }

  public updateNode(nodeId: unknown, request?: UpdateNodeRequest): CanvasCore {
    this.graphStoreController.updateNode(nodeId, request ?? {});

    return this;
  }

  public removeNode(nodeId: unknown): CanvasCore {
    this.graphStoreController.removeNode(nodeId);

    return this;
  }

  public addEdge(request: AddEdgeRequest): CanvasCore {
    this.graphStoreController.addEdge(request);

    return this;
  }

  public updateEdge(edgeId: unknown, request?: UpdateEdgeRequest): CanvasCore {
    this.graphStoreController.updateEdge(edgeId, request ?? {});

    return this;
  }

  public removeEdge(edgeId: unknown): CanvasCore {
    this.graphStoreController.removeEdge(edgeId);

    return this;
  }

  public markPort(request: MarkPortRequest): CanvasCore {
    this.graphStoreController.markPort(request);

    return this;
  }

  public updatePort(portId: string, request?: UpdatePortRequest): CanvasCore {
    this.graphStoreController.updatePort(portId, request ?? {});

    return this;
  }

  public unmarkPort(portId: string): CanvasCore {
    this.graphStoreController.unmarkPort(portId);

    return this;
  }

  public patchViewportMatrix(request: PatchMatrixRequest): CanvasCore {
    this.internalTransformation.patchViewportMatrix(request);

    return this;
  }

  public patchContentMatrix(request: PatchMatrixRequest): CanvasCore {
    this.internalTransformation.patchContentMatrix(request);

    return this;
  }

  public clear(): CanvasCore {
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
