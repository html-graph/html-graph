import { Point, zero } from "@/point";
import { createRotatedPoint } from "../create-rotated-point";
import { createRoundedPath } from "../create-rounded-path";

export const createCycleSquareLinePath = (
  fromVect: Point,
  arrowLength: number,
  side: number,
  minPortOffset: number,
  roundness: number,
  hasSourceArrow: boolean,
  hasTargetArrow: boolean,
): string => {
  const g = minPortOffset;
  const s = side;
  const x1 = arrowLength + g;
  const x2 = x1 + 2 * s;

  const linePoints = [
    { x: arrowLength, y: zero.y },
    { x: x1, y: zero.y },
    { x: x1, y: side },
    { x: x2, y: side },
    { x: x2, y: -side },
    { x: x1, y: -side },
    { x: x1, y: zero.y },
    { x: arrowLength, y: zero.y },
  ];

  const rp = linePoints.map((p) => createRotatedPoint(p, fromVect, zero));

  const preLine = `M ${zero.x} ${zero.y} L ${rp[0].x} ${rp[0].y} `;

  return `${hasSourceArrow || hasTargetArrow ? "" : preLine}${createRoundedPath(rp, roundness)}`;
};
