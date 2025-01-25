import { Point } from "@/point";

export const createFlipDirectionVector: (
  vector: Point,
  flipX: number,
  flipY: number,
) => Point = (vector: Point, flipX: number, flipY: number) => {
  return { x: flipX * vector.x, y: flipY * vector.y };
};
