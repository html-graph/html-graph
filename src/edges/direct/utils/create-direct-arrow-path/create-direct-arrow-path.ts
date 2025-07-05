import { createArrowPath } from "@/edges/line/create-arrow-path";
import { Point } from "@/point";

export const createDirectArrowPath = (params: {
  readonly totalDistance: number;
  readonly to: Point;
  readonly offset: number;
  readonly flip: number;
  readonly shift: Point;
  readonly arrowWidth: number;
  readonly arrowLength: number;
}): string => {
  if (params.totalDistance === 0) {
    return "";
  }

  const ratio = params.offset / params.totalDistance;

  const x = params.flip * params.to.x;
  const y = params.flip * params.to.y;

  const shift: Point = {
    x: x * ratio + params.shift.x,
    y: y * ratio + params.shift.y,
  };

  const direction: Point = {
    x: x / params.totalDistance,
    y: y / params.totalDistance,
  };

  return createArrowPath(
    direction,
    shift,
    params.arrowLength,
    params.arrowWidth,
  );
};
