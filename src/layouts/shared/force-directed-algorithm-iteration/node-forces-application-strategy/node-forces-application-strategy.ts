import { Identifier } from "@/identifier";
import { MutablePoint } from "../../mutable-point";
import { Point } from "@/point";

export interface NodeForcesApplicationStrategy {
  apply(
    nodeCoords: ReadonlyMap<Identifier, Point>,
    forces: ReadonlyMap<Identifier, MutablePoint>,
  ): void;
}
