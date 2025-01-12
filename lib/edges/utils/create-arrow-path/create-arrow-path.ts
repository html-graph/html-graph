import { Point } from "@/point";
import { createRotatedPoint } from "../create-rotated-point";

export const createArrowPath: (
  vect: Point,
  shiftX: number,
  shiftY: number,
  arrowLength: number,
  arrowWidth: number,
) => string = (
  vect: Point,
  shiftX: number,
  shiftY: number,
  arrowLength: number,
  arrowWidth: number,
) => {
  const arrowPoints: Point[] = [
    { x: 0, y: 0 },
    { x: arrowLength, y: arrowWidth },
    { x: arrowLength, y: -arrowWidth },
  ];

  const p: readonly Point[] = arrowPoints
    .map((p) => createRotatedPoint(p, vect, { x: 0, y: 0 }))
    .map((p) => ({ x: p.x + shiftX, y: p.y + shiftY }));

  const amove = `M ${p[0].x} ${p[0].y}`;
  const aline1 = `L ${p[1].x} ${p[1].y}`;
  const aline2 = `L ${p[2].x} ${p[2].y}`;

  return `${amove} ${aline1} ${aline2}`;
};
