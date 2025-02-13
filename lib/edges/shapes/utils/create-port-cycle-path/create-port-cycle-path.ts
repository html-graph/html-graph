import { Point, zero } from "@/point";
import { createRotatedPoint } from "../create-rotated-point";

export const createPortCyclePath = (
  fromVect: Point,
  radius: number,
  smallRadius: number,
  arrowLength: number,
  hasSourceArrow: boolean,
  hasTargetArrow: boolean,
): string => {
  const r = smallRadius;
  const R = radius;
  const len = Math.sqrt(r * r + R * R);
  const g = r + R;
  const px = arrowLength + len * (1 - R / g);
  const py = (r * R) / g;

  const points: Point[] = [
    { x: arrowLength, y: zero.y },
    { x: px, y: py },
    { x: px, y: -py },
  ];

  const rp = points.map((p) => createRotatedPoint(p, fromVect, zero));

  const c = [
    `M ${rp[0].x} ${rp[0].y}`,
    `A ${r} ${r} 0 0 1 ${rp[1].x} ${rp[1].y}`,
    `A ${R} ${R} 0 1 0 ${rp[2].x} ${rp[2].y}`,
    `A ${r} ${r} 0 0 1 ${rp[0].x} ${rp[0].y}`,
  ].join(" ");

  const preLine = `M ${0} ${0} L ${rp[0].x} ${rp[0].y} `;

  return `${hasSourceArrow || hasTargetArrow ? "" : preLine}${c}`;
};
