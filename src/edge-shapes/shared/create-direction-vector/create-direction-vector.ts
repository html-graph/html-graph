import { Point } from "@/point";

export const createDirectionVector = (dir: number): Point => {
  return { x: Math.cos(dir), y: Math.sin(dir) };
};
