import { Point } from "@/point";

export interface Line {
  readonly points: readonly Point[];
  readonly midpoint: Point;
}
