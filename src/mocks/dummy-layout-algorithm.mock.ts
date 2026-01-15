import { Identifier } from "@/identifier";
import { LayoutAlgorithm, LayoutAlgorithmParams } from "@/layouts";
import { Point } from "@/point";

export class DummyLayoutAlgorithm implements LayoutAlgorithm {
  public calculateCoordinates(
    params: LayoutAlgorithmParams,
  ): ReadonlyMap<Identifier, Point> {
    const { graph } = params;

    const result = new Map<Identifier, Point>();

    graph.getAllNodeIds().forEach((nodeId) => {
      result.set(nodeId, { x: 0, y: 0 });
    });

    return result;
  }
}
