import { Point } from "@/point";

export const transposePoint = (point: Point): Point => {
  return { x: point.y, y: point.x };
};
