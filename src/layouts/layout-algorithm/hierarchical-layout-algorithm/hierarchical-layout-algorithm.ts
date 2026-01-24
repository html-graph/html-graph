import { Identifier } from "@/identifier";
import { Point } from "@/point";
import { LayoutAlgorithm } from "../layout-algorithm";
import { LayoutAlgorithmParams } from "../layout-algorithm-params";
import { HierarchicalLayoutAlgorithmParams } from "./hierarchical-layout-algorithm-params";

export class HierarchicalLayoutAlgorithm implements LayoutAlgorithm {
  public constructor(
    private readonly params: HierarchicalLayoutAlgorithmParams,
  ) {
    console.log(this.params);
  }

  public calculateCoordinates(
    params: LayoutAlgorithmParams,
  ): ReadonlyMap<Identifier, Point> {
    // 1. make forest
    // 2. traverse each tree from leaves, calculate diameters
    // 3. traverse each tree from root, calculate coords
    // 4. apply transformation

    const { graph } = params;
    const beginning: Point = { x: 0, y: 0 };

    const result = new Map<Identifier, Point>();

    graph.getAllNodeIds().forEach((nodeId) => {
      result.set(nodeId, beginning);
    });

    return result;
  }
}
