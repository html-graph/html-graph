import { Point } from "@/point";
import { EdgeBox } from "./edge-box";

export interface StructuredEdgeShapeModel {
  readonly box: EdgeBox;

  readonly linePath: string;

  readonly linePoints: readonly Point[];

  readonly sourceArrowPath: string;

  readonly targetArrowPath: string;

  readonly sourcePoint: Point;

  readonly targetPoint: Point;

  calculateMidpoint(): Point;
}
