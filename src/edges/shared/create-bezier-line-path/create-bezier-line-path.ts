import { createRotatedPoint } from "../create-rotated-point";
import { Point, zero } from "@/point";

export const createBezierLinePath = (params: {
  readonly to: Point;
  readonly sourceDirection: Point;
  readonly targetDirection: Point;
  readonly arrowLength: number;
  readonly curvature: number;
  readonly hasSourceArrow: boolean;
  readonly hasTargetArrow: boolean;
}): string => {
  const begin = createRotatedPoint(
    { x: params.arrowLength, y: zero.y },
    params.sourceDirection,
    zero,
  );

  const end = createRotatedPoint(
    { x: params.to.x - params.arrowLength, y: params.to.y },
    params.targetDirection,
    params.to,
  );

  const bezierBegin: Point = {
    x: begin.x + params.sourceDirection.x * params.curvature,
    y: begin.y + params.sourceDirection.y * params.curvature,
  };

  const bezierEnd: Point = {
    x: end.x - params.targetDirection.x * params.curvature,
    y: end.y - params.targetDirection.y * params.curvature,
  };

  const curve = `M ${begin.x} ${begin.y} C ${bezierBegin.x} ${bezierBegin.y}, ${bezierEnd.x} ${bezierEnd.y}, ${end.x} ${end.y}`;
  const preLine = params.hasSourceArrow
    ? ""
    : `M ${zero.x} ${zero.y} L ${begin.x} ${begin.y} `;
  const postLine = params.hasTargetArrow
    ? ""
    : ` M ${end.x} ${end.y} L ${params.to.x} ${params.to.y}`;

  return `${preLine}${curve}${postLine}`;
};
