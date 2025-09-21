import { Graph } from "@/graph";
import { Identifier } from "@/identifier";
import { AnimatedLayoutAlgorithm } from "@/layout-algorithm";
import { Point } from "@/point";

export class DummyAnimatedLayoutAlgorithm implements AnimatedLayoutAlgorithm {
  public constructor(
    private readonly defaultX = 0,
    private readonly defaultY = 0,
  ) {}

  public calculateNextCoordinates(
    graph: Graph,
  ): ReadonlyMap<Identifier, Point> {
    const result = new Map<Identifier, Point>();

    graph.getAllNodeIds().forEach((nodeId) => {
      result.set(nodeId, { x: this.defaultX, y: this.defaultY });
    });

    return result;
  }
}
