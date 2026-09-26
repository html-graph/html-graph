import { Point } from "@/point";
import { EdgeBox } from "./edge-box";

export interface StructuredEdgeShapeModel {
  readonly box: EdgeBox;
  readonly line: {
    readonly path: string;
    readonly points: readonly Point[];
  };
  readonly source: {
    readonly arrowPath: string;
    readonly coords: Point;
  };
  readonly target: {
    readonly arrowPath: string;
    readonly coords: Point;
  };
  calculateMidpoint(): Point;
}
