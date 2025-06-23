import { Point } from "@/point";

export type CreatePathFn = (
  sourceDirection: Point,
  targetDirection: Point,
  to: Point,
  flipX: number,
  flipY: number,
) => string;
