import { createRotatedPoint } from "../create-rotated-point";
import { Point, zero } from "@/point";

export const createArrowPath: (
  vect: Point,
  shift: Point,
  arrowLength: number,
  arrowWidth: number,
) => string = (
  vect: Point,
  shift: Point,
  arrowLength: number,
  arrowWidth: number,
) => {
  const arrowPoints: Point[] = [
    zero,
    { x: arrowLength, y: arrowWidth },
    { x: arrowLength, y: -arrowWidth },
  ];

  const p: readonly Point[] = arrowPoints
    .map((p) => createRotatedPoint(p, vect, zero))
    .map((p) => ({ x: p.x + shift.x, y: p.y + shift.y }));

  const amove = `M ${p[0].x} ${p[0].y}`;
  const aline1 = `L ${p[1].x} ${p[1].y}`;
  const aline2 = `L ${p[2].x} ${p[2].y}`;

  return `${amove} ${aline1} ${aline2}`;
};
