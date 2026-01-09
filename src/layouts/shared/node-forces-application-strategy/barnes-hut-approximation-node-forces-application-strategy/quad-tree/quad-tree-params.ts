import { Identifier } from "@/identifier";
import { AreaBox } from "./area-box";
import { Point } from "@/point";

export interface QuadTreeParams {
  readonly box: AreaBox;
  readonly coords: ReadonlyMap<Identifier, Point>;
  readonly areaRadiusThreshold: number;
  readonly nodeMass: number;
  readonly nodeCharge: number;
}
