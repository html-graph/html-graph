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
    // 1. make graph components
    // 2. make tree
    // 3. traverse tree from leaves, calculate radii
    // 4. traverse tree from root, calculate coords
    // 5. apply transformation

    const { graph } = params;
    const beginning: Point = { x: 0, y: 0 };

    const result = new Map<Identifier, Point>();

    graph.getAllNodeIds().forEach((nodeId) => {
      result.set(nodeId, beginning);
    });

    return result;
  }
}
