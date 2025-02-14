import { Point, zero } from "@/point";
import { createRotatedPoint } from "../create-rotated-point";

export const createBezierLinePath = (params: {
  readonly to: Point;
  readonly fromVect: Point;
  readonly toVect: Point;
  readonly arrowLength: number;
  readonly curvature: number;
  readonly hasSourceArrow: boolean;
  readonly hasTargetArrow: boolean;
}): string => {
  const pb = createRotatedPoint(
    { x: params.arrowLength, y: zero.y },
    params.fromVect,
    zero,
  );

  const pe = createRotatedPoint(
    { x: params.to.x - params.arrowLength, y: params.to.y },
    params.toVect,
    params.to,
  );

  const bpb: Point = {
    x: pb.x + params.fromVect.x * params.curvature,
    y: pb.y + params.fromVect.y * params.curvature,
  };

  const bpe: Point = {
    x: pe.x - params.toVect.x * params.curvature,
    y: pe.y - params.toVect.y * params.curvature,
  };

  const lcurve = `M ${pb.x} ${pb.y} C ${bpb.x} ${bpb.y}, ${bpe.x} ${bpe.y}, ${pe.x} ${pe.y}`;
  const preLine = params.hasSourceArrow
    ? ""
    : `M ${zero.x} ${zero.y} L ${pb.x} ${pb.y} `;
  const postLine = params.hasTargetArrow
    ? ""
    : ` M ${pe.x} ${pe.y} L ${params.to.x} ${params.to.y}`;

  return `${preLine}${lcurve}${postLine}`;
};
