import { Identifier } from "@/identifier";
import { Point } from "@/point";
import { LayoutAlgorithmParams } from "./layout-algorithm-params";

export interface LayoutAlgorithm {
  calculateCoordinates(
    params: LayoutAlgorithmParams,
  ): ReadonlyMap<Identifier, Point>;
}
