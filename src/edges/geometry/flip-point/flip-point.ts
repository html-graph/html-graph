import { Point } from "@/point";

export const flipPoint = (
  point: Point,
  flipX: number,
  flipY: number,
  to: Point,
): Point => {
  return {
    x: flipX * point.x + ((1 - flipX) / 2) * to.x,
    y: flipY * point.y + ((1 - flipY) / 2) * to.y,
  };
};
