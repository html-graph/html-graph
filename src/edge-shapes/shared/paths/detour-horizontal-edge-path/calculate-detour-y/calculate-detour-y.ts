import { Point } from "@/point";

export const calculateDotourY = (
  from: Point,
  to: Point,
  detourDistance: number,
): number => {
  const max = Math.max(from.y, to.y);
  const min = Math.min(from.y, to.y);

  return (detourDistance >= 0 ? max : min) + detourDistance;
};
