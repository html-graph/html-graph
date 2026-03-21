import { Point } from "@/point";

export const calculateDetourX = (
  from: Point,
  to: Point,
  detourDistance: number,
): number => {
  const max = Math.max(from.x, to.x);
  const min = Math.min(from.x, to.x);

  return (detourDistance >= 0 ? max : min) + detourDistance;
};
