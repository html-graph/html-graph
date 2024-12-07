import { GraphStore } from "./graph-store";

export class PublicGraphStore {
  public constructor(private readonly graphStore: GraphStore) {}

  public getNode(nodeId: string): { x: number; y: number } | null {
    const node = this.graphStore.getNode(nodeId);

    if (node === undefined) {
      return null;
    }

    return { x: node.x, y: node.y };
  }

  public getPort(portId: string): { nodeId: string } | null {
    const nodeId = this.graphStore.getPortNode(portId);

    if (nodeId === undefined) {
      return null;
    }

    return { nodeId };
  }

  public getConnection(
    connectionId: string,
  ): { from: string; to: string } | null {
    const connection = this.graphStore.getConnection(connectionId);

    if (connection === undefined) {
      return null;
    }

    return { from: connection.from, to: connection.to };
  }

  public getAllNodes(): readonly string[] {
    return this.graphStore.getAllNodes();
  }

  public getAllPorts(): readonly string[] {
    return this.graphStore.getAllPorts();
  }

  public getAllConnections(): readonly string[] {
    return this.graphStore.getAllConnections();
  }

  public hasNode(nodeId: string): boolean {
    return this.graphStore.hasNode(nodeId);
  }

  public hasPort(portId: string): boolean {
    return this.graphStore.hasPort(portId);
  }

  public hasConnection(connectionId: string): boolean {
    return this.graphStore.hasConnection(connectionId);
  }

  public getPortIncomingConnections(portId: string): readonly string[] {
    return this.graphStore.getPortIncomingConnections(portId);
  }

  public getPortOutcomingConnections(portId: string): readonly string[] {
    return this.graphStore.getPortOutcomingConnections(portId);
  }

  public getPortCycleConnections(portId: string): readonly string[] {
    return this.graphStore.getPortCycleConnections(portId);
  }

  public getPortAdjacentConnections(portId: string): readonly string[] {
    return this.graphStore.getPortAdjacentConnections(portId);
  }

  public getNodeIncomingConnections(nodeId: string): readonly string[] {
    return this.graphStore.getNodeIncomingConnections(nodeId);
  }

  public getNodeOutcomingConnections(nodeId: string): readonly string[] {
    return this.graphStore.getNodeOutcomingConnections(nodeId);
  }

  public getNodeCycleConnections(nodeId: string): readonly string[] {
    return this.graphStore.getNodeCycleConnections(nodeId);
  }

  public getNodeAdjacentConnections(nodeId: string): readonly string[] {
    return this.graphStore.getNodeAdjacentConnections(nodeId);
  }
}
