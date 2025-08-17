import { Identifier } from "@html-graph/html-graph";

export class Graph {
  private readonly nodes = new Set<Identifier>();

  private readonly edges = new Map<
    Identifier,
    { from: Identifier; to: Identifier }
  >();

  private readonly outgoingEdges = new Map<Identifier, Set<Identifier>>();

  private readonly incomingEdges = new Map<Identifier, Set<Identifier>>();

  public addNode(nodeId: Identifier): void {
    this.nodes.add(nodeId);
  }

  public addEdge(edgeId: Identifier, from: Identifier, to: Identifier): void {
    this.edges.set(edgeId, { from, to });

    const outgoingEdges = this.outgoingEdges.get(from);

    if (outgoingEdges === undefined) {
      this.outgoingEdges.set(from, new Set([edgeId]));
    } else {
      outgoingEdges.add(to);
    }

    const incomingEdges = this.incomingEdges.get(from);

    if (incomingEdges === undefined) {
      this.incomingEdges.set(to, new Set([edgeId]));
    } else {
      incomingEdges.add(from);
    }
  }

  public removeNode(nodeId: Identifier): void {
    const outgoingEdges = this.outgoingEdges.get(nodeId);

    const edgesToRemove = new Set<Identifier>();

    if (outgoingEdges !== undefined) {
      outgoingEdges.forEach((edgeId) => {
        edgesToRemove.add(edgeId);
      });
    }

    const incomingEdges = this.incomingEdges.get(nodeId);

    if (incomingEdges !== undefined) {
      incomingEdges.forEach((edgeId) => {
        edgesToRemove.add(edgeId);
      });
    }

    edgesToRemove.forEach((edgeId) => {
      this.removeEdge(edgeId);
    });

    this.nodes.delete(nodeId);
  }

  public removeEdge(edgeId: Identifier): void {
    const { from, to } = this.edges.get(edgeId)!;

    const outgoingEdges = this.outgoingEdges.get(from)!;
    outgoingEdges.delete(edgeId);

    if (outgoingEdges.size === 0) {
      this.outgoingEdges.delete(from);
    }

    const incomingEdges = this.incomingEdges.get(to)!;
    incomingEdges.delete(from);

    if (incomingEdges.size === 0) {
      this.incomingEdges.delete(edgeId);
    }

    this.edges.delete(edgeId);
  }
}
