import { Point } from "../../point";
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
  const arrowPoints: [number, number][] = [
    [0, 0],
    [arrowLength, arrowWidth],
    [arrowLength, -arrowWidth],
  ];

  const p = arrowPoints
    .map((p) => createRotatedPoint(p, vect, [0, 0]))
    .map((p) => [p[0] + shiftX, p[1] + shiftY]);

  const amove = `M ${p[0][0]} ${p[0][1]}`;
  const aline1 = `L ${p[1][0]} ${p[1][1]}`;
  const aline2 = `L ${p[2][0]} ${p[2][1]}`;

  return `${amove} ${aline1} ${aline2}`;
};
