import { Point } from "@/point";

export type DirectEdgeShapeModel = (
  | {
      readonly empty: true;
    }
  | {
      readonly empty: false;
    }
) & {
  readonly rectangle: {
    readonly x: number;
    readonly y: number;
    readonly width: number;
    readonly height: number;
  };
  readonly from: Point;
  readonly to: Point;
};
