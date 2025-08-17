import { Identifier } from "@html-graph/html-graph";
import { Edge } from "./edge";

export class Graph {
  private readonly nodesInternal = new Set<Identifier>();

  public readonly nodes: ReadonlySet<Identifier> = this.nodesInternal;

  private readonly edgesInternal = new Map<Identifier, Edge>();

  public readonly edges: ReadonlyMap<Identifier, Edge> = this.edgesInternal;

  private readonly outgoingEdgesInternal = new Map<
    Identifier,
    Set<Identifier>
  >();

  public readonly outgoingEdges: ReadonlyMap<
    Identifier,
    ReadonlySet<Identifier>
  > = this.outgoingEdgesInternal;

  private readonly incomingEdgesInternal = new Map<
    Identifier,
    Set<Identifier>
  >();

  public readonly incomingEdges: ReadonlyMap<
    Identifier,
    ReadonlySet<Identifier>
  > = this.incomingEdgesInternal;

  public addNode(nodeId: Identifier): void {
    this.nodesInternal.add(nodeId);
  }

  public addEdge(edgeId: Identifier, from: Identifier, to: Identifier): void {
    this.edgesInternal.set(edgeId, { from, to });

    const outgoingEdges = this.outgoingEdgesInternal.get(from);

    if (outgoingEdges === undefined) {
      this.outgoingEdgesInternal.set(from, new Set([edgeId]));
    } else {
      outgoingEdges.add(edgeId);
    }

    const incomingEdges = this.incomingEdgesInternal.get(to);

    if (incomingEdges === undefined) {
      this.incomingEdgesInternal.set(to, new Set([edgeId]));
    } else {
      incomingEdges.add(edgeId);
    }
  }

  public removeNode(nodeId: Identifier): void {
    const outgoingEdges = this.outgoingEdgesInternal.get(nodeId);

    const edgesToRemove = new Set<Identifier>();

    if (outgoingEdges !== undefined) {
      outgoingEdges.forEach((edgeId) => {
        edgesToRemove.add(edgeId);
      });
    }

    const incomingEdges = this.incomingEdgesInternal.get(nodeId);

    if (incomingEdges !== undefined) {
      incomingEdges.forEach((edgeId) => {
        edgesToRemove.add(edgeId);
      });
    }

    edgesToRemove.forEach((edgeId) => {
      this.removeEdge(edgeId);
    });

    this.nodesInternal.delete(nodeId);
  }

  public removeEdge(edgeId: Identifier): void {
    const { from, to } = this.edgesInternal.get(edgeId)!;

    const outgoingEdges = this.outgoingEdgesInternal.get(from)!;
    outgoingEdges.delete(edgeId);

    if (outgoingEdges.size === 0) {
      this.outgoingEdgesInternal.delete(from);
    }

    const incomingEdges = this.incomingEdgesInternal.get(to)!;
    incomingEdges.delete(edgeId);

    if (incomingEdges.size === 0) {
      this.incomingEdgesInternal.delete(to);
    }

    this.edgesInternal.delete(edgeId);
  }
}
