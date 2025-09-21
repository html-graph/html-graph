import { Graph } from "@/graph";
import { Identifier } from "@/identifier";
import { AnimatedLayoutAlgorithm } from "@/layout-algorithm";
import { Point } from "@/point";

export class DummyAnimatedLayoutAlgorithm implements AnimatedLayoutAlgorithm {
  public calculateNextCoordinates(
    graph: Graph,
  ): ReadonlyMap<Identifier, Point> {
    const result = new Map<Identifier, Point>();

    graph.getAllNodeIds().forEach((nodeId) => {
      result.set(nodeId, { x: 0, y: 0 });
    });

    return result;
  }
}
