import { Identifier } from "@/identifier";
import type { Point, MutablePoint } from "@/point";

export interface NodeForcesApplicationStrategy {
  apply(
    nodesCoords: ReadonlyMap<Identifier, Point>,
    forces: ReadonlyMap<Identifier, MutablePoint>,
  ): void;
}
