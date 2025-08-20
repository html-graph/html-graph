import { Identifier } from "@html-graph/html-graph";
import { TopologyGraph } from "./topology-graph";

export class Layout {
  private readonly nodesInternal = new Map<
    Identifier,
    {
      readonly x: number;
      readonly y: number;
    }
  >();

  public nodes: ReadonlyMap<
    Identifier,
    {
      readonly x: number;
      readonly y: number;
    }
  > = this.nodesInternal;

  public constructor(
    private readonly graph: TopologyGraph,
    private readonly startNodeId: Identifier,
  ) {}

  public organize(): void {
    this.graph.nodes.forEach((nodeId) => {
      this.nodesInternal.set(nodeId, { x: 0, y: 0 });
    });

    this.nodesInternal.set(this.startNodeId, { x: 0, y: 0 });
  }
}
