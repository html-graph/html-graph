import { Point } from "@/point";

export const createFlipDirectionVector: (
  direction: number,
  flipX: number,
  flipY: number,
) => Point = (direction: number, flipX: number, flipY: number) => {
  return { x: flipX * Math.cos(direction), y: flipY * Math.sin(direction) };
};
