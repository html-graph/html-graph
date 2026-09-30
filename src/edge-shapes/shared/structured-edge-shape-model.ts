import { Point } from "@/point";
import { EdgeBox } from "./edge-box";

export interface StructuredEdgeModel {
  readonly box: EdgeBox;

  readonly linePath: string;

  readonly sourceArrowPath: string;

  readonly targetArrowPath: string;

  readonly sourceArrowPoint: Point;

  readonly targetArrowPoint: Point;

  calculateMidpoint(): Point;
}
