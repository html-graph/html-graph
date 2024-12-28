import { Point } from "../../point";

export const createDirectionVector: (
  direction: number,
  flipX: number,
  flipY: number,
) => Point = (direction: number, flipX: number, flipY: number) => {
  return [flipX * Math.cos(direction), flipY * Math.sin(direction)];
};
