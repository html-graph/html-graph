import { Point } from "@/point";
import { EdgeBox } from "./edge-box";

export interface StructuredEdgeModel {
  readonly box: EdgeBox;

  readonly linePath: string;

  readonly sourceArrowPath: string;

  readonly targetArrowPath: string;

  readonly sourcePoint: Point;

  readonly targetPoint: Point;

  calculateMidpoint(): Point;
}
