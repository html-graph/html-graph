import { Viewport } from "./viewport";
import { Graph } from "./graph";
import { IdGenerator } from "./id-generator";
import { AddEdgeRequest } from "./add-edge-request";
import { AddNodeRequest } from "./add-node-request";
import { MarkPortRequest } from "./mark-port-request";
import { PatchMatrixRequest } from "./patch-matrix-request";
import { UpdateEdgeRequest } from "./update-edge-request";
import { UpdateNodeRequest } from "./update-node-request";
import { UpdatePortRequest } from "./update-port-request";
import { createPair, EventEmitter, EventHandler } from "@/event-subject";
import { GraphStore } from "@/graph-store";
import { ViewportStore } from "@/viewport-store";
import { HtmlView } from "@/html-view";
import { CanvasParams } from "./canvas-params";
import { CanvasError } from "./canvas-error";
import { Identifier } from "@/identifier";

export class Canvas {
  private readonly nodeIdGenerator = new IdGenerator(
    (nodeId) => this.graph.getNode(nodeId) !== null,
  );

  private readonly portIdGenerator = new IdGenerator(
    (portId) => this.graph.getPort(portId) !== null,
  );

  private readonly edgeIdGenerator = new IdGenerator(
    (edgeId) => this.graph.getEdge(edgeId) !== null,
  );

  private readonly onAfterNodeAdded = (nodeId: Identifier): void => {
    this.htmlView.attachNode(nodeId);
  };

  private readonly onAfterNodeUpdated = (nodeId: Identifier): void => {
    this.htmlView.updateNodePosition(nodeId);

    const edgeIds = this.graphStore.getNodeAdjacentEdgeIds(nodeId);

    edgeIds.forEach((edge) => {
      this.htmlView.renderEdge(edge);
    });
  };

  private readonly onAfterNodePriorityUpdated = (nodeId: Identifier): void => {
    this.htmlView.updateNodePriority(nodeId);
  };

  private readonly onBeforeNodeRemoved = (nodeId: Identifier): void => {
    this.graphStore.getNodePortIds(nodeId)!.forEach((portId) => {
      this.unmarkPort(portId);
    });

    this.htmlView.detachNode(nodeId);
  };

  private readonly onAfterPortUpdated = (portId: Identifier): void => {
    const edgeIds = this.graphStore.getPortAdjacentEdgeIds(portId);

    edgeIds.forEach((edge) => {
      this.htmlView.renderEdge(edge);
    });
  };

  private readonly onBeforePortUnmarked = (portId: Identifier): void => {
    this.graphStore.getPortAdjacentEdgeIds(portId).forEach((edgeId) => {
      this.removeEdge(edgeId);
    });
  };

  private readonly onAfterEdgeAdded = (edgeId: Identifier): void => {
    this.htmlView.attachEdge(edgeId);
  };

  private readonly onAfterEdgeShapeUpdated = (edgeId: Identifier): void => {
    this.htmlView.updateEdgeShape(edgeId);
  };

  private readonly onAfterEdgeUpdated = (edgeId: Identifier): void => {
    this.htmlView.renderEdge(edgeId);
  };

  private readonly onAfterEdgePriorityUpdated = (edgeId: Identifier): void => {
    this.htmlView.updateEdgePriority(edgeId);
  };

  private readonly onBeforeEdgeRemoved = (edgeId: Identifier): void => {
    this.htmlView.detachEdge(edgeId);
  };

  private readonly onBeforeClear = (): void => {
    this.nodeIdGenerator.reset();
    this.portIdGenerator.reset();
    this.edgeIdGenerator.reset();

    this.htmlView.clear();
  };

  private readonly onBeforeDestroyEmitter: EventEmitter<void>;

  private destroyed = false;

  /**
   * emits event just before destruction of canvas
   */
  public readonly onBeforeDestroy: EventHandler<void>;

  public constructor(
    /**
     * provides api for accessing model of rendered graph
     */
    public readonly graph: Graph,
    /**
     * provides api for accessing viewport state
     */
    public readonly viewport: Viewport,
    private readonly graphStore: GraphStore,
    private readonly viewportStore: ViewportStore,
    private readonly htmlView: HtmlView,
    private readonly params: CanvasParams,
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

    [this.onBeforeDestroyEmitter, this.onBeforeDestroy] = createPair();
  }

  /**
   * adds new node
   */
  public addNode(request: AddNodeRequest): Canvas {
    const id = this.nodeIdGenerator.create(request.id);

    if (this.graphStore.getNode(id) !== undefined) {
      throw new CanvasError("failed to add node with existing id");
    }

    if (this.graphStore.getElementNodeId(request.element) !== undefined) {
      throw new CanvasError(
        "failed to add node with html element already in use by another node",
      );
    }

    this.graphStore.addNode({
      id,
      element: request.element,
      x: request.x,
      y: request.y,
      centerFn: request.centerFn ?? this.params.nodes.centerFn,
      priority: request.priority ?? this.params.nodes.priorityFn(),
    });

    if (request.ports !== undefined) {
      for (const port of request.ports) {
        this.markPort({
          id: port.id,
          element: port.element,
          nodeId: id,
          direction: port.direction,
        });
      }
    }

    return this;
  }

  /**
   * updates node parameters
   */
  public updateNode(nodeId: Identifier, request?: UpdateNodeRequest): Canvas {
    const node = this.graphStore.getNode(nodeId);

    if (node === undefined) {
      throw new CanvasError("failed to update nonexistent node");
    }

    this.graphStore.updateNode(nodeId, request ?? {});

    return this;
  }

  /**
   * removes specified node
   * all the ports of node get unmarked
   * all the edges adjacent to node get removed
   */
  public removeNode(nodeId: Identifier): Canvas {
    if (this.graphStore.getNode(nodeId) === undefined) {
      throw new CanvasError("failed to remove nonexistent node");
    }

    this.graphStore.removeNode(nodeId);

    return this;
  }

  /**
   * marks specified element as a port for specified node
   */
  public markPort(request: MarkPortRequest): Canvas {
    const id = this.portIdGenerator.create(request.id);

    if (this.graphStore.getPort(id) !== undefined) {
      throw new CanvasError("failed to add port with existing id");
    }

    if (this.graphStore.getNode(request.nodeId) === undefined) {
      throw new CanvasError("failed to mark port for nonexistent node");
    }

    this.graphStore.addPort({
      id,
      element: request.element,
      nodeId: request.nodeId,
      direction: request.direction ?? this.params.ports.direction,
    });

    return this;
  }

  /**
   * updates port and edges attached to it
   */
  public updatePort(portId: Identifier, request?: UpdatePortRequest): Canvas {
    const port = this.graphStore.getPort(portId);

    if (port === undefined) {
      throw new CanvasError("failed to update nonexistent port");
    }

    this.graphStore.updatePort(portId, request ?? {});

    return this;
  }

  /**
   * unmarks specified port
   * all the edges adjacent to the port get removed
   */
  public unmarkPort(portId: Identifier): Canvas {
    if (this.graphStore.getPort(portId) === undefined) {
      throw new CanvasError("failed to unmark nonexistent port");
    }

    this.graphStore.removePort(portId);

    return this;
  }

  /**
   * adds new edge
   */
  public addEdge(request: AddEdgeRequest): Canvas {
    const id = this.edgeIdGenerator.create(request.id);

    if (this.graphStore.getEdge(id) !== undefined) {
      throw new CanvasError("failed to add edge with existing id");
    }

    if (this.graphStore.getPort(request.from) === undefined) {
      throw new CanvasError("failed to add edge from nonexistent port");
    }

    if (this.graphStore.getPort(request.to) === undefined) {
      throw new CanvasError("failed to add edge to nonexistent port");
    }

    this.graphStore.addEdge({
      id,
      from: request.from,
      to: request.to,
      shape: request.shape ?? this.params.edges.shapeFactory(id),
      priority: request.priority ?? this.params.edges.priorityFn(),
    });

    return this;
  }

  /**
   * updates specified edge
   */
  public updateEdge(edgeId: Identifier, request?: UpdateEdgeRequest): Canvas {
    const edge = this.graphStore.getEdge(edgeId);

    if (edge === undefined) {
      throw new CanvasError("failed to update nonexistent edge");
    }

    this.graphStore.updateEdge(edgeId, request ?? {});

    return this;
  }

  /**
   * removes specified edge
   */
  public removeEdge(edgeId: Identifier): Canvas {
    if (this.graphStore.getEdge(edgeId) === undefined) {
      throw new CanvasError("failed to remove nonexistent edge");
    }

    this.graphStore.removeEdge(edgeId);

    return this;
  }

  /**
   * clears canvas from nodes and edges
   * canvas gets rolled back to initial state and can be reused
   */
  public clear(): Canvas {
    this.graphStore.clear();

    return this;
  }

  /**
   * applies transformation for viewport matrix
   */
  public patchViewportMatrix(request: PatchMatrixRequest): Canvas {
    this.viewportStore.patchViewportMatrix(request);

    return this;
  }

  /**
   * applies transformation for content matrix
   */
  public patchContentMatrix(request: PatchMatrixRequest): Canvas {
    this.viewportStore.patchContentMatrix(request);

    return this;
  }

  /**
   * destroys canvas
   * canvas element gets rolled back to initial state, and can not be reused
   */
  public destroy(): void {
    if (this.destroyed) {
      return;
    }

    this.clear();

    this.onBeforeDestroyEmitter.emit();

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

    this.htmlView.destroy();

    this.destroyed = true;
  }
}
