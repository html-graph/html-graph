import { Point } from "@/point";

export interface Part {
  readonly start: Point;
  readonly end: Point;
  readonly distance: number;
}
