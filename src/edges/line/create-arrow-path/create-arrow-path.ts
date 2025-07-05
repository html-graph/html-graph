import { createRotatedPoint } from "../../shared";
import { Point, zero } from "@/point";

export const createArrowPath = (
  directionVector: Point,
  shift: Point,
  arrowLength: number,
  arrowWidth: number,
): string => {
  const arrowPoints: Point[] = [
    zero,
    { x: arrowLength, y: arrowWidth },
    { x: arrowLength, y: -arrowWidth },
  ];

  const p: readonly Point[] = arrowPoints
    .map((p) => createRotatedPoint(p, directionVector, zero))
    .map((p) => ({ x: p.x + shift.x, y: p.y + shift.y }));

  const move = `M ${p[0].x} ${p[0].y}`;
  const line1 = `L ${p[1].x} ${p[1].y}`;
  const line2 = `L ${p[2].x} ${p[2].y}`;

  return `${move} ${line1} ${line2} Z`;
};
