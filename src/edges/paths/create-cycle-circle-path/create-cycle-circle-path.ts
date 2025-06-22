import { Point, zero } from "@/point";
import { createRotatedPoint } from "../../create-rotated-point";

export const createCycleCirclePath = (params: {
  readonly fromVector: Point;
  readonly radius: number;
  readonly smallRadius: number;
  readonly arrowLength: number;
  readonly hasSourceArrow: boolean;
  readonly hasTargetArrow: boolean;
}): string => {
  const smallRadius = params.smallRadius;
  const radius = params.radius;
  const distance = Math.sqrt(smallRadius * smallRadius + radius * radius);
  const g = smallRadius + radius;
  const jointX = params.arrowLength + distance * (1 - radius / g);
  const jointY = (smallRadius * radius) / g;

  const points: Point[] = [
    { x: params.arrowLength, y: zero.y },
    { x: jointX, y: jointY },
    { x: jointX, y: -jointY },
  ];

  const rotatedPoints = points.map((p) =>
    createRotatedPoint(p, params.fromVector, zero),
  );

  const c = [
    `M ${rotatedPoints[0].x} ${rotatedPoints[0].y}`,
    `A ${smallRadius} ${smallRadius} 0 0 1 ${rotatedPoints[1].x} ${rotatedPoints[1].y}`,
    `A ${radius} ${radius} 0 1 0 ${rotatedPoints[2].x} ${rotatedPoints[2].y}`,
    `A ${smallRadius} ${smallRadius} 0 0 1 ${rotatedPoints[0].x} ${rotatedPoints[0].y}`,
  ].join(" ");

  const preLine = `M ${0} ${0} L ${rotatedPoints[0].x} ${rotatedPoints[0].y} `;

  return `${params.hasSourceArrow || params.hasTargetArrow ? "" : preLine}${c}`;
};
