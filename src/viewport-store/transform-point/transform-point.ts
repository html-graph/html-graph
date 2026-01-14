import { Point } from "@/point";
import { TransformState } from "../transform-state";

export const transformPoint = (matrix: TransformState, point: Point): Point => {
  return {
    x: matrix.scale * point.x + matrix.x,
    y: matrix.scale * point.y + matrix.y,
  };
};
