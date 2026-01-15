import { EventHandler } from "@/event-subject";
import { GraphStore } from "@/graph-store";
import { GraphEdge } from "./graph-edge";
import { GraphNode } from "./graph-node";
import { GraphPort } from "./graph-port";
import { Identifier } from "@/identifier";

export class Graph {
  public readonly onAfterNodeAdded: EventHandler<Identifier>;

  public readonly onAfterNodeUpdated: EventHandler<Identifier>;

  public readonly onAfterNodePriorityUpdated: EventHandler<Identifier>;

  public readonly onBeforeNodeRemoved: EventHandler<Identifier>;

  public readonly onAfterPortMarked: EventHandler<Identifier>;

  public readonly onAfterPortUpdated: EventHandler<Identifier>;

  public readonly onBeforePortUnmarked: EventHandler<Identifier>;

  public readonly onAfterEdgeAdded: EventHandler<Identifier>;

  public readonly onAfterEdgeShapeUpdated: EventHandler<Identifier>;

  public readonly onAfterEdgeUpdated: EventHandler<Identifier>;

  public readonly onAfterEdgePriorityUpdated: EventHandler<Identifier>;

  public readonly onBeforeEdgeRemoved: EventHandler<Identifier>;

  public readonly onBeforeClear: EventHandler<void>;

  public constructor(private readonly graphStore: GraphStore) {
    this.onAfterNodeAdded = this.graphStore.onAfterNodeAdded;

    this.onAfterNodeUpdated = this.graphStore.onAfterNodeUpdated;

    this.onAfterNodePriorityUpdated =
      this.graphStore.onAfterNodePriorityUpdated;

    this.onBeforeNodeRemoved = this.graphStore.onBeforeNodeRemoved;

    this.onAfterPortMarked = this.graphStore.onAfterPortAdded;

    this.onAfterPortUpdated = this.graphStore.onAfterPortUpdated;

    this.onBeforePortUnmarked = this.graphStore.onBeforePortRemoved;

    this.onAfterEdgeAdded = this.graphStore.onAfterEdgeAdded;

    this.onAfterEdgeShapeUpdated = this.graphStore.onAfterEdgeShapeUpdated;

    this.onAfterEdgeUpdated = this.graphStore.onAfterEdgeUpdated;

    this.onAfterEdgePriorityUpdated =
      this.graphStore.onAfterEdgePriorityUpdated;

    this.onBeforeEdgeRemoved = this.graphStore.onBeforeEdgeRemoved;

    this.onBeforeClear = this.graphStore.onBeforeClear;
  }

  public hasNode(nodeId: Identifier): boolean {
    return this.graphStore.hasNode(nodeId);
  }

  public getNode(nodeId: Identifier): GraphNode {
    const node = this.graphStore.getNode(nodeId);
    const { payload } = node;

    return {
      element: node.element,
      x: payload.x,
      y: payload.y,
      centerFn: payload.centerFn,
      priority: payload.priority,
    };
  }

  public findNodeIdByElement(element: HTMLElement): Identifier | null {
    return this.graphStore.findNodeIdByElement(element) ?? null;
  }

  public getAllNodeIds(): readonly Identifier[] {
    return this.graphStore.getAllNodeIds();
  }

  public hasPort(portId: Identifier): boolean {
    return this.graphStore.hasPort(portId);
  }

  public getPort(portId: Identifier): GraphPort | null {
    const port = this.graphStore.getPort(portId);

    if (port === undefined) {
      return null;
    }

    return {
      element: port.element,
      direction: port.payload.direction,
      nodeId: port.nodeId,
    };
  }

  public getAllPortIds(): readonly Identifier[] {
    return this.graphStore.getAllPortIds();
  }

  public getNodePortIds(nodeId: Identifier): readonly Identifier[] | null {
    return this.graphStore.getNodePortIds(nodeId) ?? null;
  }

  public findPortIdsByElement(element: HTMLElement): readonly Identifier[] {
    return this.graphStore.findPortIdsByElement(element);
  }

  public getAllEdgeIds(): readonly Identifier[] {
    return this.graphStore.getAllEdgeIds();
  }

  public hasEdge(edgeId: Identifier): boolean {
    return this.graphStore.hasEdge(edgeId);
  }

  public getEdge(edgeId: Identifier): GraphEdge | null {
    const edge = this.graphStore.getEdge(edgeId);

    if (edge === undefined) {
      return null;
    }

    const payload = edge.payload;

    return {
      from: edge.from,
      to: edge.to,
      priority: payload.priority,
      shape: payload.shape,
    };
  }

  public getPortIncomingEdgeIds(
    portId: Identifier,
  ): readonly Identifier[] | null {
    if (!this.graphStore.hasPort(portId)) {
      return null;
    }

    return this.graphStore.getPortIncomingEdgeIds(portId);
  }

  public getPortOutgoingEdgeIds(
    portId: Identifier,
  ): readonly Identifier[] | null {
    if (!this.graphStore.hasPort(portId)) {
      return null;
    }

    return this.graphStore.getPortOutgoingEdgeIds(portId);
  }

  public getPortCycleEdgeIds(portId: Identifier): readonly Identifier[] | null {
    if (!this.graphStore.hasPort(portId)) {
      return null;
    }

    return this.graphStore.getPortCycleEdgeIds(portId);
  }

  public getPortAdjacentEdgeIds(
    portId: Identifier,
  ): readonly Identifier[] | null {
    if (!this.graphStore.hasPort(portId)) {
      return null;
    }

    return this.graphStore.getPortAdjacentEdgeIds(portId);
  }

  public getNodeIncomingEdgeIds(
    nodeId: Identifier,
  ): readonly Identifier[] | null {
    if (!this.graphStore.hasNode(nodeId)) {
      return null;
    }

    return this.graphStore.getNodeIncomingEdgeIds(nodeId);
  }

  public getNodeOutgoingEdgeIds(
    nodeId: Identifier,
  ): readonly Identifier[] | null {
    if (!this.graphStore.hasNode(nodeId)) {
      return null;
    }

    return this.graphStore.getNodeOutgoingEdgeIds(nodeId);
  }

  public getNodeCycleEdgeIds(nodeId: Identifier): readonly Identifier[] | null {
    if (!this.graphStore.hasNode(nodeId)) {
      return null;
    }

    return this.graphStore.getNodeCycleEdgeIds(nodeId);
  }

  public getNodeAdjacentEdgeIds(
    nodeId: Identifier,
  ): readonly Identifier[] | null {
    if (!this.graphStore.hasNode(nodeId)) {
      return null;
    }

    return this.graphStore.getNodeAdjacentEdgeIds(nodeId);
  }
}
