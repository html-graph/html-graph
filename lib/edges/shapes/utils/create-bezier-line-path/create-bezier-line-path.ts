import { Point, zero } from "@/point";
import { createRotatedPoint } from "../create-rotated-point";

export const createBezierLinePath = (
  to: Point,
  fromVect: Point,
  toVect: Point,
  arrowLength: number,
  curvature: number,
  hasSourceArrow: boolean,
  hasTargetArrow: boolean,
): string => {
  const pb = createRotatedPoint({ x: arrowLength, y: zero.y }, fromVect, zero);

  const pe = createRotatedPoint({ x: to.x - arrowLength, y: to.y }, toVect, to);

  const bpb: Point = {
    x: pb.x + fromVect.x * curvature,
    y: pb.y + fromVect.y * curvature,
  };

  const bpe: Point = {
    x: pe.x - toVect.x * curvature,
    y: pe.y - toVect.y * curvature,
  };

  const lcurve = `M ${pb.x} ${pb.y} C ${bpb.x} ${bpb.y}, ${bpe.x} ${bpe.y}, ${pe.x} ${pe.y}`;
  const preLine = hasSourceArrow
    ? ""
    : `M ${zero.x} ${zero.y} L ${pb.x} ${pb.y} `;
  const postLine = hasTargetArrow ? "" : ` M ${pe.x} ${pe.y} L ${to.x} ${to.y}`;

  return `${preLine}${lcurve}${postLine}`;
};
