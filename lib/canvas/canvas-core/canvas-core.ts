import { CoreOptions, createOptions } from "./options";
import { GraphStore } from "@/graph-store";
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
import { UpdatePortRequest } from "../update-port-request";
import { PatchMatrixRequest } from "../patch-matrix-request";
import { HtmlController } from "@/html-controller";
import {
  GraphStoreController,
  GraphStoreControllerOptions,
} from "@/graph-store-controller";
import { PublicGraphStore } from "@/public-graph-store";

/**
 * Provides low level API for acting on graph
 */
export class CanvasCore implements Canvas {
  public readonly transformation: PublicViewportTransformer;

  public readonly model: PublicGraphStore;

  private readonly graphStoreController: GraphStoreController;

  private readonly htmlController: HtmlController;

  private readonly viewportTransformer: ViewportTransformer;

  private readonly graphStore = new GraphStore();

  public constructor(private readonly apiOptions?: CoreOptions) {
    const options: GraphStoreControllerOptions = createOptions(this.apiOptions);

    this.viewportTransformer = new ViewportTransformer();
    this.graphStore = new GraphStore();

    this.model = new PublicGraphStore(this.graphStore);
    this.transformation = new PublicViewportTransformer(
      this.viewportTransformer,
    );

    this.htmlController = new HtmlController(
      this.graphStore,
      this.viewportTransformer,
    );

    this.graphStoreController = new GraphStoreController(
      this.graphStore,
      options,
      {
        onAfterNodeAdded: (nodeId): void => {
          this.htmlController.attachNode(nodeId);
        },
        onAfterEdgeAdded: (edgeId): void => {
          this.htmlController.attachEdge(edgeId);
        },
        onAfterEdgePriorityUpdated: (edgeId): void => {
          this.htmlController.updateEdgePriority(edgeId);
        },
        onAfterEdgeUpdated: (edgeId): void => {
          this.htmlController.renderEdge(edgeId);
        },
        onAfterPortUpdated: (portId): void => {
          const edges = this.graphStore.getPortAdjacentEdgeIds(portId);

          edges.forEach((edge) => {
            this.htmlController.renderEdge(edge);
          });
        },
        onAfterNodePriorityUpdated: (nodeId): void => {
          this.htmlController.updateNodePriority(nodeId);
        },
        onAfterNodeUpdated: (nodeId): void => {
          this.htmlController.updateNodeCoordinates(nodeId);
          const edges = this.graphStore.getNodeAdjacentEdgeIds(nodeId);

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
      },
    );
  }

  public attach(element: HTMLElement): CanvasCore {
    this.htmlController.attach(element);

    return this;
  }

  public detach(): CanvasCore {
    this.htmlController.detach();

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
    this.viewportTransformer.patchViewportMatrix(request);
    this.htmlController.applyTransform();

    return this;
  }

  public patchContentMatrix(request: PatchMatrixRequest): CanvasCore {
    this.viewportTransformer.patchContentMatrix(request);
    this.htmlController.applyTransform();

    return this;
  }

  public clear(): CanvasCore {
    this.htmlController.clear();
    this.graphStoreController.clear();

    return this;
  }

  public destroy(): void {
    this.htmlController.destroy();
    this.graphStoreController.clear();
  }
}
