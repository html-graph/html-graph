import { GraphStore } from "../graph-store";

export class PublicGraphStore {
  constructor(private readonly graphStore: GraphStore) {}

  getNode(nodeId: string): { x: number; y: number } | null {
    const node = this.graphStore.getNode(nodeId);

    if (node === undefined) {
      return null;
    }

    return { x: node.x, y: node.y };
  }

  getPort(portId: string): { nodeId: string } | null {
    const nodeId = this.graphStore.getPortNode(portId);

    if (nodeId === undefined) {
      return null;
    }

    return { nodeId };
  }

  getConnection(connectionId: string): { from: string; to: string } | null {
    const connection = this.graphStore.getConnection(connectionId);

    if (connection === undefined) {
      return null;
    }

    return { from: connection.from, to: connection.to };
  }

  getAllNodes(): readonly string[] {
    return this.graphStore.getAllNodes();
  }

  getAllPorts(): readonly string[] {
    return this.graphStore.getAllPorts();
  }

  getAllConnections(): readonly string[] {
    return this.graphStore.getAllConnections();
  }

  hasNode(nodeId: string): boolean {
    return this.graphStore.hasNode(nodeId);
  }

  hasPort(portId: string): boolean {
    return this.graphStore.hasPort(portId);
  }

  hasConnection(connectionId: string): boolean {
    return this.graphStore.hasConnection(connectionId);
  }

  getPortIncomingConnections(portId: string): readonly string[] {
    return this.graphStore.getPortIncomingConnections(portId);
  }

  getPortOutcomingConnections(portId: string): readonly string[] {
    return this.graphStore.getPortOutcomingConnections(portId);
  }

  getPortCycleConnections(portId: string): readonly string[] {
    return this.graphStore.getPortCycleConnections(portId);
  }

  getPortAdjacentConnections(portId: string): readonly string[] {
    return this.graphStore.getPortAdjacentConnections(portId);
  }

  getNodeIncomingConnections(nodeId: string): readonly string[] {
    return this.graphStore.getNodeIncomingConnections(nodeId);
  }

  getNodeOutcomingConnections(nodeId: string): readonly string[] {
    return this.graphStore.getNodeOutcomingConnections(nodeId);
  }

  getNodeCycleConnections(nodeId: string): readonly string[] {
    return this.graphStore.getNodeCycleConnections(nodeId);
  }

  getNodeAdjacentConnections(nodeId: string): readonly string[] {
    return this.graphStore.getNodeAdjacentConnections(nodeId);
  }
}
