import { Point } from "@/point";
import { EdgeBox } from "./edge-box";

export interface StructuredEdgeModel {
  readonly box: EdgeBox;

  readonly linePath: string;

  readonly sourceArrowPath: string;

  readonly targetArrowPath: string;

  readonly shapeSourcePoint: Point;

  readonly shapeTargetPoint: Point;

  calculateMidpoint(): Point;
}
