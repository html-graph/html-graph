import { Graph } from "@/graph";
import { Identifier } from "@/identifier";
import { Point } from "@/point";

export interface AnimatedLayoutAlgorithm {
  calculateNextCoordinates(
    graph: Graph,
    dt: number,
    staticNodes: ReadonlySet<Identifier>,
  ): ReadonlyMap<Identifier, Point>;
}
