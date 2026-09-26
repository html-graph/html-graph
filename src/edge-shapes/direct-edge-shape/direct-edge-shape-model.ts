import { Point } from "@/point";

export interface DirectEdgeShapeModel {
  readonly box: {
    readonly x: number;
    readonly y: number;
    readonly width: number;
    readonly height: number;
  };
  readonly line: {
    readonly path: string;
    readonly begin: Point;
    readonly end: Point;
  };
  readonly source: {
    readonly arrowPath: string;
    readonly coords: Point;
  };
  readonly target: {
    readonly arrowPath: string;
    readonly coords: Point;
  };
  readonly calculateMidpoint: () => Point;
}
