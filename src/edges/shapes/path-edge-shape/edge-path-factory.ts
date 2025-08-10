import { Point } from "@/point";
import { EdgePath } from "../../paths";

export type EdgePathFactory = (
  sourceDirection: Point,
  targetDirection: Point,
  to: Point,
  flipX: number,
  flipY: number,
) => EdgePath;
