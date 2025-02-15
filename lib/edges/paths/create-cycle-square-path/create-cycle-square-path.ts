import { Point, zero } from "@/point";
import { createRotatedPoint, createRoundedPath } from "../../utils";

export const createCycleSquarePath = (params: {
  readonly fromVect: Point;
  readonly arrowLength: number;
  readonly side: number;
  readonly arrowOffset: number;
  readonly roundness: number;
  readonly hasSourceArrow: boolean;
  readonly hasTargetArrow: boolean;
}): string => {
  const g = params.arrowOffset;
  const s = params.side;
  const x1 = params.arrowLength + g;
  const x2 = x1 + 2 * s;

  const linePoints = [
    { x: params.arrowLength, y: zero.y },
    { x: x1, y: zero.y },
    { x: x1, y: params.side },
    { x: x2, y: params.side },
    { x: x2, y: -params.side },
    { x: x1, y: -params.side },
    { x: x1, y: zero.y },
    { x: params.arrowLength, y: zero.y },
  ];

  const rp = linePoints.map((p) =>
    createRotatedPoint(p, params.fromVect, zero),
  );

  const preLine = `M ${zero.x} ${zero.y} L ${rp[0].x} ${rp[0].y} `;

  return `${params.hasSourceArrow || params.hasTargetArrow ? "" : preLine}${createRoundedPath(rp, params.roundness)}`;
};
