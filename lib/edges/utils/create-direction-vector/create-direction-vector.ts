import { Point } from "@/point";

export const createDirectionVector: (
  direction: number,
  flipX: number,
  flipY: number,
) => Point = (direction: number, flipX: number, flipY: number) => {
  return { x: flipX * Math.cos(direction), y: flipY * Math.sin(direction) };
};
