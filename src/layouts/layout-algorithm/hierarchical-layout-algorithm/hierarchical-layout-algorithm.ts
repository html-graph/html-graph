import { Identifier } from "@/identifier";
import { Point } from "@/point";
import { LayoutAlgorithm } from "../layout-algorithm";
import { LayoutAlgorithmParams } from "../layout-algorithm-params";
import { HierararchicalLayoutAlgorithmParams } from "./hierarchical-layout-algorithm-params";

export class HierarchicalLayoutAlgorithm implements LayoutAlgorithm {
  public constructor(
    private readonly params: HierararchicalLayoutAlgorithmParams,
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

    console.log(params);

    return new Map();
  }
}
