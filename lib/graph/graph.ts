import { EventHandler } from "@/event-subject";
import { GraphStore } from "../graph-store";
import { GraphEdge } from "./graph-edge";
import { GraphNode } from "./graph-node";
import { GraphPort } from "./graph-port";

/**
 * This entity is responsible for providing access to end user in a safe way
 */
export class Graph {
  public readonly onAfterNodeAdded: EventHandler<unknown>;

  /**
   * @deprecated
   * use onAfterNodeUpdated instead
   */
  public readonly onAfterNodeCoordinatesUpdated: EventHandler<unknown>;

  public readonly onAfterNodeUpdated: EventHandler<unknown>;

  public readonly onAfterNodePriorityUpdated: EventHandler<unknown>;

  public readonly onBeforeNodeRemoved: EventHandler<unknown>;

  public readonly onAfterPortMarked: EventHandler<unknown>;

  /**
   * @deprecated
   * use onAfterPortMarked instead
   */
  public readonly onAfterPortAdded: EventHandler<unknown>;

  public readonly onAfterPortUpdated: EventHandler<unknown>;

  /**
   * @deprecated
   * use onAfterNodeUpdated instead
   */
  public readonly onAfterPortDirectionUpdated: EventHandler<unknown>;

  public readonly onBeforePortUnmarked: EventHandler<unknown>;

  /**
   * @deprecated
   * use onBeforePortUnmarked instead
   */
  public readonly onBeforePortRemoved: EventHandler<unknown>;

  public readonly onAfterEdgeAdded: EventHandler<unknown>;

  public readonly onAfterEdgeShapeUpdated: EventHandler<unknown>;

  public readonly onAfterEdgeUpdated: EventHandler<unknown>;

  /**
   * @deprecated
   * use onAfterEdgeUpdated instead
   */
  public readonly onAfterEdgeAdjacentPortsUpdated: EventHandler<unknown>;

  public readonly onAfterEdgePriorityUpdated: EventHandler<unknown>;

  public readonly onBeforeEdgeRemoved: EventHandler<unknown>;

  public readonly onBeforeClear: EventHandler<void>;

  public constructor(private readonly graphStore: GraphStore) {
    this.onAfterNodeAdded = this.graphStore.onAfterNodeAdded;

    this.onAfterNodeUpdated = this.graphStore.onAfterNodeUpdated;

    this.onAfterNodeCoordinatesUpdated = this.onAfterNodeUpdated;

    this.onAfterNodePriorityUpdated =
      this.graphStore.onAfterNodePriorityUpdated;

    this.onBeforeNodeRemoved = this.graphStore.onBeforeNodeRemoved;

    this.onAfterPortMarked = this.graphStore.onAfterPortAdded;

    this.onAfterPortAdded = this.onAfterPortMarked;

    this.onAfterPortUpdated = this.graphStore.onAfterPortUpdated;

    this.onAfterPortDirectionUpdated = this.onAfterPortUpdated;

    this.onBeforePortUnmarked = this.graphStore.onBeforePortRemoved;

    this.onBeforePortRemoved = this.onBeforePortUnmarked;

    this.onAfterEdgeAdded = this.graphStore.onAfterEdgeAdded;

    this.onAfterEdgeShapeUpdated = this.graphStore.onAfterEdgeShapeUpdated;

    this.onAfterEdgeUpdated = this.graphStore.onAfterEdgeUpdated;

    this.onAfterEdgeAdjacentPortsUpdated = this.onAfterEdgeUpdated;

    this.onAfterEdgePriorityUpdated =
      this.graphStore.onAfterEdgePriorityUpdated;

    this.onBeforeEdgeRemoved = this.graphStore.onBeforeEdgeRemoved;

    this.onBeforeClear = this.graphStore.onBeforeClear;
  }

  public getNode(nodeId: unknown): GraphNode | null {
    const node = this.graphStore.getNode(nodeId);

    if (node === undefined) {
      return null;
    }

    return {
      element: node.element,
      x: node.x,
      y: node.y,
      centerFn: node.centerFn,
      priority: node.priority,
    };
  }

  public getAllNodeIds(): readonly unknown[] {
    return this.graphStore.getAllNodeIds();
  }

  public getPort(portId: unknown): GraphPort | null {
    const port = this.graphStore.getPort(portId);

    if (port === undefined) {
      return null;
    }

    return {
      element: port.element,
      direction: port.direction,
      nodeId: port.nodeId,
    };
  }

  public getAllPortIds(): readonly unknown[] {
    return this.graphStore.getAllPortIds();
  }

  public getNodePortIds(nodeId: unknown): readonly unknown[] | null {
    return this.graphStore.getNodePortIds(nodeId) ?? null;
  }

  /**
   * @deprecated
   * use graph.getPort()?.nodeId ?? null instead
   */
  public getPortNodeId(portId: unknown): unknown | null {
    return this.graphStore.getPort(portId)?.nodeId ?? null;
  }

  public getAllEdgeIds(): readonly unknown[] {
    return this.graphStore.getAllEdgeIds();
  }

  public getEdge(edgeId: unknown): GraphEdge | null {
    const edge = this.graphStore.getEdge(edgeId);

    if (edge === undefined) {
      return null;
    }

    return { from: edge.from, to: edge.to, priority: edge.priority };
  }

  public getPortIncomingEdgeIds(portId: unknown): readonly unknown[] | null {
    if (this.graphStore.getPort(portId) === undefined) {
      return null;
    }

    return this.graphStore.getPortIncomingEdgeIds(portId);
  }

  public getPortOutcomingEdgeIds(portId: unknown): readonly unknown[] | null {
    if (this.graphStore.getPort(portId) === undefined) {
      return null;
    }

    return this.graphStore.getPortOutcomingEdgeIds(portId);
  }

  public getPortCycleEdgeIds(portId: unknown): readonly unknown[] | null {
    if (this.graphStore.getPort(portId) === undefined) {
      return null;
    }

    return this.graphStore.getPortCycleEdgeIds(portId);
  }

  public getPortAdjacentEdgeIds(portId: unknown): readonly unknown[] | null {
    if (this.graphStore.getPort(portId) === undefined) {
      return null;
    }

    return this.graphStore.getPortAdjacentEdgeIds(portId);
  }

  public getNodeIncomingEdgeIds(nodeId: unknown): readonly unknown[] | null {
    if (this.graphStore.getNode(nodeId) === undefined) {
      return null;
    }

    return this.graphStore.getNodeIncomingEdgeIds(nodeId);
  }

  public getNodeOutcomingEdgeIds(nodeId: unknown): readonly unknown[] | null {
    if (this.graphStore.getNode(nodeId) === undefined) {
      return null;
    }

    return this.graphStore.getNodeOutcomingEdgeIds(nodeId);
  }

  public getNodeCycleEdgeIds(nodeId: unknown): readonly unknown[] | null {
    if (this.graphStore.getNode(nodeId) === undefined) {
      return null;
    }

    return this.graphStore.getNodeCycleEdgeIds(nodeId);
  }

  public getNodeAdjacentEdgeIds(nodeId: unknown): readonly unknown[] | null {
    if (this.graphStore.getNode(nodeId) === undefined) {
      return null;
    }

    return this.graphStore.getNodeAdjacentEdgeIds(nodeId);
  }
}
