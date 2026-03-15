import { Point } from "@/point";

export interface EdgeRectangle {
  readonly x: number;
  readonly y: number;
  readonly width: number;
  readonly height: number;
  readonly flipX: number;
  readonly flipY: number;
  readonly from: Point;
  readonly to: Point;
}
