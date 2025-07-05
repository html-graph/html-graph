import { Point } from "@/point";

export const createDirectLinePoint = (params: {
  readonly totalDistance: number;
  readonly to: Point;
  readonly offset: number;
  readonly hasArrow: boolean;
  readonly flip: number;
  readonly shift: Point;
  readonly arrowLength: number;
}): Point => {
  const arrowOffset = params.hasArrow ? params.arrowLength : 0;
  const totalOffset = params.offset + arrowOffset;
  const targetRatio = (params.flip * totalOffset) / params.totalDistance;

  return {
    x: params.to.x * targetRatio + params.shift.x,
    y: params.to.y * targetRatio + params.shift.y,
  };
};
