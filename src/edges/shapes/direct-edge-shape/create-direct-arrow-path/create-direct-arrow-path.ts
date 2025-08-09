import { createArrowPath } from "../../../shared";
import { Point } from "@/point";

export const createDirectArrowPath = (params: {
  readonly diagonalDistance: number;
  readonly to: Point;
  readonly offset: number;
  readonly flip: number;
  readonly shift: Point;
  readonly arrowWidth: number;
  readonly arrowLength: number;
}): string => {
  if (params.diagonalDistance === 0) {
    return "";
  }

  const ratio = params.offset / params.diagonalDistance;

  const x = params.flip * params.to.x;
  const y = params.flip * params.to.y;

  const shift: Point = {
    x: x * ratio + params.shift.x,
    y: y * ratio + params.shift.y,
  };

  const direction: Point = {
    x: x / params.diagonalDistance,
    y: y / params.diagonalDistance,
  };

  return createArrowPath(
    direction,
    shift,
    params.arrowLength,
    params.arrowWidth,
  );
};
