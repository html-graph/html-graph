import { Point, zero } from "@/point";
import { createRotatedPoint } from "../../utils/create-rotated-point";

export const createCycleCirclePath = (params: {
  readonly fromVector: Point;
  readonly radius: number;
  readonly smallRadius: number;
  readonly arrowLength: number;
  readonly hasSourceArrow: boolean;
  readonly hasTargetArrow: boolean;
}): string => {
  const r = params.smallRadius;
  const R = params.radius;
  const len = Math.sqrt(r * r + R * R);
  const g = r + R;
  const px = params.arrowLength + len * (1 - R / g);
  const py = (r * R) / g;

  const points: Point[] = [
    { x: params.arrowLength, y: zero.y },
    { x: px, y: py },
    { x: px, y: -py },
  ];

  const rp = points.map((p) => createRotatedPoint(p, params.fromVector, zero));

  const c = [
    `M ${rp[0].x} ${rp[0].y}`,
    `A ${r} ${r} 0 0 1 ${rp[1].x} ${rp[1].y}`,
    `A ${R} ${R} 0 1 0 ${rp[2].x} ${rp[2].y}`,
    `A ${r} ${r} 0 0 1 ${rp[0].x} ${rp[0].y}`,
  ].join(" ");

  const preLine = `M ${0} ${0} L ${rp[0].x} ${rp[0].y} `;

  return `${params.hasSourceArrow || params.hasTargetArrow ? "" : preLine}${c}`;
};
