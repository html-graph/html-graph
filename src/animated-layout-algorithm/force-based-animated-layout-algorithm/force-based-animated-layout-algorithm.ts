import { Identifier } from "@/identifier";
import { Point } from "@/point";
import { AnimatedLayoutAlgorithm } from "../animated-layout-algorithm";

export class ForceBasedAnimatedLayoutAlgorithm
  implements AnimatedLayoutAlgorithm
{
  public calculateNextCoordinates(): ReadonlyMap<Identifier, Point> {
    return new Map();
  }
}
