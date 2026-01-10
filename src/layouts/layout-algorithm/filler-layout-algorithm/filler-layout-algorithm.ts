import { Identifier } from "@/identifier";
import { Point } from "@/point";
import { LayoutAlgorithm } from "../layout-algorithm";

export class FillerLayoutAlgorithm implements LayoutAlgorithm {
  public calculateCoordinates(): ReadonlyMap<Identifier, Point> {
    return new Map();
  }
}
