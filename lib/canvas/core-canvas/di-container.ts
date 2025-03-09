import {
  GraphStoreController,
  GraphStoreControllerEvents,
} from "@/graph-store-controller";
import { CoreOptions, createDefaults } from "./options";
import {
  PublicViewportTransformer,
  ViewportTransformer,
} from "@/viewport-transformer";
import { PublicGraphStore } from "@/public-graph-store";
import { GraphStore } from "@/graph-store";
import { HtmlController } from "@/html-controller";

export class DiContainer {
  public readonly transformation: PublicViewportTransformer;

  public readonly model: PublicGraphStore;

  public readonly internalTransformation: ViewportTransformer;

  public readonly internalModel: GraphStore;

  public readonly htmlController: HtmlController;

  public readonly graphStoreController: GraphStoreController;

  private readonly events: GraphStoreControllerEvents = {
    onAfterNodeAdded: (nodeId): void => {
      this.htmlController.attachNode(nodeId);
    },
    onAfterEdgeAdded: (edgeId): void => {
      this.htmlController.attachEdge(edgeId);
    },
    onAfterEdgeShapeUpdated: (edgeId): void => {
      this.htmlController.updateEdgeShape(edgeId);
    },
    onAfterEdgePriorityUpdated: (edgeId): void => {
      this.htmlController.updateEdgePriority(edgeId);
    },
    onAfterEdgeUpdated: (edgeId): void => {
      this.htmlController.renderEdge(edgeId);
    },
    onAfterPortUpdated: (portId): void => {
      const edges = this.internalModel.getPortAdjacentEdgeIds(portId);

      edges.forEach((edge) => {
        this.htmlController.renderEdge(edge);
      });
    },
    onAfterNodePriorityUpdated: (nodeId): void => {
      this.htmlController.updateNodePriority(nodeId);
    },
    onAfterNodeUpdated: (nodeId): void => {
      this.htmlController.updateNodeCoordinates(nodeId);
      const edges = this.internalModel.getNodeAdjacentEdgeIds(nodeId);

      edges.forEach((edge) => {
        this.htmlController.renderEdge(edge);
      });
    },
    onBeforeEdgeRemoved: (edgeId): void => {
      this.htmlController.detachEdge(edgeId);
    },
    onBeforeNodeRemoved: (nodeId): void => {
      this.htmlController.detachNode(nodeId);
    },
  };

  public constructor(coreOptions: CoreOptions) {
    const defaults = createDefaults(coreOptions);

    this.internalModel = new GraphStore();
    this.model = new PublicGraphStore(this.internalModel);

    this.internalTransformation = new ViewportTransformer(() => {
      this.htmlController.applyTransform();
    });

    this.transformation = new PublicViewportTransformer(
      this.internalTransformation,
    );

    this.htmlController = new HtmlController(
      this.internalModel,
      this.internalTransformation,
    );

    this.graphStoreController = new GraphStoreController(
      this.internalModel,
      defaults,
      this.events,
    );
  }
}
