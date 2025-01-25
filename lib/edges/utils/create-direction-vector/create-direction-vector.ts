import { Point } from "@/point";

export const createDirectionVector: (direction: number) => Point = (
  direction: number,
) => {
  return { x: Math.cos(direction), y: Math.sin(direction) };
};
