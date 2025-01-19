import { GraphEdge } from "./graph-edge";
import { GraphNode } from "./graph-node";
import { GraphPort } from "./graph-port";
import { GraphStore } from "./graph-store";

export class PublicGraphStore {
  public constructor(private readonly graphStore: GraphStore) {}

  public getAllNodes(): readonly GraphNode[] {
    return this.graphStore
      .getAllNodes()
      .map((nodeId) => this.graphStore.getNode(nodeId)!);
  }

  public getAllPorts(): readonly unknown[] {
    return this.graphStore.getAllPorts();
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

  public getNodePorts(nodeId: unknown): readonly unknown[] | undefined {
    return this.graphStore.getNodePorts(nodeId);
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

  public getPortNode(portId: string): unknown | null {
    return this.graphStore.getPortNode(portId) ?? null;
  }

  public getAllEdges(): readonly unknown[] {
    return this.graphStore.getAllEdges();
  }

  public getEdge(edgeId: unknown): GraphEdge | null {
    const edge = this.graphStore.getEdge(edgeId);

    if (edge === undefined) {
      return null;
    }

    return { from: edge.from, to: edge.to, priority: edge.priority };
  }

  public getPortAdjacentEdges(portId: string): readonly unknown[] {
    return this.graphStore.getPortAdjacentEdges(portId);
  }

  public getNodeAdjacentEdges(nodeId: unknown): readonly unknown[] {
    return this.graphStore.getNodeAdjacentEdges(nodeId);
  }

  public getPortIncomingEdges(portId: unknown): readonly unknown[] {
    return this.graphStore.getPortIncomingEdges(portId);
  }

  public getPortOutcomingEdges(portId: unknown): readonly unknown[] {
    return this.graphStore.getPortOutcomingEdges(portId);
  }

  public getPortCycleEdges(portId: unknown): readonly unknown[] {
    return this.graphStore.getPortCycleEdges(portId);
  }

  public getNodeIncomingEdges(nodeId: unknown): readonly unknown[] {
    return this.graphStore.getNodeIncomingEdges(nodeId);
  }

  public getNodeOutcomingEdges(nodeId: unknown): readonly unknown[] {
    return this.graphStore.getNodeOutcomingEdges(nodeId);
  }

  public getNodeCycleEdges(nodeId: unknown): readonly unknown[] {
    return this.graphStore.getNodeCycleEdges(nodeId);
  }
}
