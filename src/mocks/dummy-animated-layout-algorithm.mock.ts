import {
  AnimatedLayoutAlgorithm,
  AnimatedLayoutAlgorithmParams,
} from "@/layouts";
import { Identifier } from "@/identifier";
import { Point } from "@/point";

export class DummyAnimatedLayoutAlgorithm implements AnimatedLayoutAlgorithm {
  public constructor(
    private readonly defaultX = 0,
    private readonly defaultY = 0,
  ) {}

  public calculateNextCoordinates(
    params: AnimatedLayoutAlgorithmParams,
  ): ReadonlyMap<Identifier, Point> {
    const { graph } = params;
    const result = new Map<Identifier, Point>();

    graph.getAllNodeIds().forEach((nodeId) => {
      result.set(nodeId, { x: this.defaultX, y: this.defaultY });
    });

    return result;
  }
}
