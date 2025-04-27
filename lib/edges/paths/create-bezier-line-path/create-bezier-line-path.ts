import { Point, zero } from "@/point";
import { createRotatedPoint } from "../../utils";

export const createBezierLinePath = (params: {
  readonly to: Point;
  readonly fromVector: Point;
  readonly toVector: Point;
  readonly arrowLength: number;
  readonly curvature: number;
  readonly hasSourceArrow: boolean;
  readonly hasTargetArrow: boolean;
}): string => {
  const pb = createRotatedPoint(
    { x: params.arrowLength, y: zero.y },
    params.fromVector,
    zero,
  );

  const pe = createRotatedPoint(
    { x: params.to.x - params.arrowLength, y: params.to.y },
    params.toVector,
    params.to,
  );

  const bpb: Point = {
    x: pb.x + params.fromVector.x * params.curvature,
    y: pb.y + params.fromVector.y * params.curvature,
  };

  const bpe: Point = {
    x: pe.x - params.toVector.x * params.curvature,
    y: pe.y - params.toVector.y * params.curvature,
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
