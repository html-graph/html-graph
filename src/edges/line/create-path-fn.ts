import { Point } from "@/point";
import { EdgePath } from "../shared";

export type CreatePathFn = (
  sourceDirection: Point,
  targetDirection: Point,
  to: Point,
  flipX: number,
  flipY: number,
) => EdgePath;
