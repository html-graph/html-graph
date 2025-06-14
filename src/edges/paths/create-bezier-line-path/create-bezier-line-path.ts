import { Point, zero } from "@/point";
import { createRotatedPoint } from "../../shared";

export const createBezierLinePath = (params: {
  readonly to: Point;
  readonly fromVector: Point;
  readonly toVector: Point;
  readonly arrowLength: number;
  readonly curvature: number;
  readonly hasSourceArrow: boolean;
  readonly hasTargetArrow: boolean;
}): string => {
  const begin = createRotatedPoint(
    { x: params.arrowLength, y: zero.y },
    params.fromVector,
    zero,
  );

  const end = createRotatedPoint(
    { x: params.to.x - params.arrowLength, y: params.to.y },
    params.toVector,
    params.to,
  );

  const bezierBegin: Point = {
    x: begin.x + params.fromVector.x * params.curvature,
    y: begin.y + params.fromVector.y * params.curvature,
  };

  const bezierEnd: Point = {
    x: end.x - params.toVector.x * params.curvature,
    y: end.y - params.toVector.y * params.curvature,
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
