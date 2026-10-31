import { Point } from "@/point";

export const createOrthogonalDirectionVector = (direction: number): Point => {
  const adjDir = direction + Math.PI / 4;
  const adjCos = Math.cos(adjDir);
  const adjSin = Math.sin(adjDir);

  if (adjCos > 0) {
    if (adjSin > 0) {
      return { x: 1, y: 0 };
    }

    return { x: 0, y: -1 };
  }

  if (adjSin > 0) {
    return { x: 0, y: 1 };
  }

  return { x: -1, y: 0 };
};
