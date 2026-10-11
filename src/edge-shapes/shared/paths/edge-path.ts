import { Point } from "@/point";

export interface EdgePath {
  readonly path: string;

  calculateMidpoint(): Point;
}
