import { createPair, EventEmitter, EventHandler } from "@/event-subject";
import { Identifier } from "@/identifier";
import { Graph } from "@/graph";
import { Viewport } from "@/viewport";
import {
  AddEdgeRequest,
  AddNodeRequest,
  GraphController,
  MarkPortRequest,
  UpdateEdgeRequest,
  UpdateNodeRequest,
  UpdatePortRequest,
} from "@/graph-controller";
import {
  FocusConfig,
  PatchMatrixRequest,
  ViewportController,
} from "@/viewport-controller";

export class Canvas {
  private readonly beforeDestroyEmitter: EventEmitter<void>;

  private destroyed = false;

  public readonly onBeforeDestroy: EventHandler<void>;

  public constructor(
    public readonly graph: Graph,
    public readonly viewport: Viewport,
    private readonly graphController: GraphController,
    private readonly viewportController: ViewportController,
  ) {
    [this.beforeDestroyEmitter, this.onBeforeDestroy] = createPair();
  }

  public addNode(request: AddNodeRequest): Canvas {
    this.graphController.addNode(request);

    return this;
  }

  public updateNode(
    nodeId: Identifier,
    request?: UpdateNodeRequest | undefined,
  ): Canvas {
    this.graphController.updateNode(nodeId, request);

    return this;
  }

  public removeNode(nodeId: Identifier): Canvas {
    this.graphController.removeNode(nodeId);

    return this;
  }

  public markPort(request: MarkPortRequest): Canvas {
    this.graphController.markPort(request);

    return this;
  }

  public updatePort(
    portId: Identifier,
    request?: UpdatePortRequest | undefined,
  ): Canvas {
    this.graphController.updatePort(portId, request);

    return this;
  }

  public unmarkPort(portId: Identifier): Canvas {
    this.graphController.unmarkPort(portId);

    return this;
  }

  public addEdge(request: AddEdgeRequest): Canvas {
    this.graphController.addEdge(request);

    return this;
  }

  public updateEdge(
    edgeId: Identifier,
    request?: UpdateEdgeRequest | undefined,
  ): Canvas {
    this.graphController.updateEdge(edgeId, request);

    return this;
  }

  public removeEdge(edgeId: Identifier): Canvas {
    this.graphController.removeEdge(edgeId);

    return this;
  }

  public clear(): Canvas {
    this.graphController.clear();

    return this;
  }

  public focus(config?: FocusConfig | undefined): Canvas {
    this.viewportController.focus(config);

    return this;
  }

  public patchViewportMatrix(request: PatchMatrixRequest): Canvas {
    this.viewportController.patchViewportMatrix(request);

    return this;
  }

  public patchContentMatrix(request: PatchMatrixRequest): Canvas {
    this.viewportController.patchContentMatrix(request);

    return this;
  }

  public destroy(): void {
    if (this.destroyed) {
      return;
    }

    this.destroyed = true;

    this.beforeDestroyEmitter.emit();

    this.graphController.destroy();
    this.viewportController.destroy();
  }
}
