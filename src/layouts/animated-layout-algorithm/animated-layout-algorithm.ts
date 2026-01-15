import { Identifier } from "@/identifier";
import { Point } from "@/point";
import { AnimatedLayoutAlgorithmParams } from "./animated-layout-algorithm-params";

export interface AnimatedLayoutAlgorithm {
  calculateNextCoordinates(
    params: AnimatedLayoutAlgorithmParams,
  ): ReadonlyMap<Identifier, Point>;
}
