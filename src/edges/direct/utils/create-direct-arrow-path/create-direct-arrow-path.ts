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
  const minOffset = Math.max(params.offset, 1);
  const ratio = minOffset / params.totalDistance;

  const arrowStart: Point = {
    x: params.flip * params.to.x * ratio,
    y: params.flip * params.to.y * ratio,
  };

  return createArrowPath(
    {
      x: arrowStart.x / minOffset,
      y: arrowStart.y / minOffset,
    },
    {
      x: arrowStart.x + params.shift.x,
      y: arrowStart.y + params.shift.y,
    },
    params.arrowLength,
    params.arrowWidth,
  );
};
