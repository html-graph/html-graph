import { Point, zero } from "@/point";
import { createRotatedPoint } from "../create-rotated-point";
import { createRoundedPath } from "../create-rounded-path";

export const createStraightLinePath = (params: {
  readonly to: Point;
  readonly sourceDirection: Point;
  readonly targetDirection: Point;
  readonly arrowLength: number;
  readonly arrowOffset: number;
  readonly roundness: number;
  readonly hasSourceArrow: boolean;
  readonly hasTargetArrow: boolean;
}): string => {
  const pba: Point = params.hasSourceArrow
    ? createRotatedPoint(
        { x: params.arrowLength, y: zero.y },
        params.sourceDirection,
        zero,
      )
    : zero;
  const pea: Point = params.hasTargetArrow
    ? createRotatedPoint(
        { x: params.to.x - params.arrowLength, y: params.to.y },
        params.targetDirection,
        params.to,
      )
    : params.to;

  const gap = params.arrowLength + params.arrowOffset;

  const pbl = createRotatedPoint(
    { x: gap, y: zero.y },
    params.sourceDirection,
    zero,
  );
  const pel = createRotatedPoint(
    { x: params.to.x - gap, y: params.to.y },
    params.targetDirection,
    params.to,
  );

  return createRoundedPath([pba, pbl, pel, pea], params.roundness);
};
