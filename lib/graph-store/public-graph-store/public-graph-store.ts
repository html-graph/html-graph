import { GraphEdge } from "./graph-edge";
import { GraphNode } from "./graph-node";
import { GraphPort } from "./graph-port";
import { AbstractGraphStore } from "../graph-store";
import { AbstractPublicGraphStore } from "./abstract-public-graph-store";

export class PublicGraphStore implements AbstractPublicGraphStore {
  public constructor(private readonly graphStore: AbstractGraphStore) {}

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
      centerFn: port.centerFn,
      direction: port.direction,
    };
  }

  public getAllPortIds(): readonly unknown[] {
    return this.graphStore.getAllPortIds();
  }

  public getNodePortIds(nodeId: unknown): readonly unknown[] | undefined {
    return this.graphStore.getNodePortIds(nodeId);
  }

  public getPortNodeId(portId: unknown): unknown | null {
    return this.graphStore.getPortNodeId(portId) ?? null;
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

  public getPortIncomingEdgeIds(portId: unknown): readonly unknown[] {
    return this.graphStore.getPortIncomingEdgeIds(portId);
  }

  public getPortOutcomingEdgeIds(portId: unknown): readonly unknown[] {
    return this.graphStore.getPortOutcomingEdgeIds(portId);
  }

  public getPortCycleEdgeIds(portId: unknown): readonly unknown[] {
    return this.graphStore.getPortCycleEdgeIds(portId);
  }

  public getPortAdjacentEdgeIds(portId: unknown): readonly unknown[] {
    return this.graphStore.getPortAdjacentEdgeIds(portId);
  }

  public getNodeIncomingEdgeIds(nodeId: unknown): readonly unknown[] {
    return this.graphStore.getNodeIncomingEdgeIds(nodeId);
  }

  public getNodeOutcomingEdgeIds(nodeId: unknown): readonly unknown[] {
    return this.graphStore.getNodeOutcomingEdgeIds(nodeId);
  }

  public getNodeCycleEdgeIds(nodeId: unknown): readonly unknown[] {
    return this.graphStore.getNodeCycleEdgeIds(nodeId);
  }

  public getNodeAdjacentEdgeIds(nodeId: unknown): readonly unknown[] {
    return this.graphStore.getNodeAdjacentEdgeIds(nodeId);
  }
}
