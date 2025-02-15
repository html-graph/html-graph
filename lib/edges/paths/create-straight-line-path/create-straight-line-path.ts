import { Point, zero } from "@/point";
import { createRotatedPoint, createRoundedPath } from "../../utils";

export const createStraightLinePath = (params: {
  readonly to: Point;
  readonly fromVect: Point;
  readonly toVect: Point;
  readonly arrowLength: number;
  readonly arrowOffset: number;
  readonly roundness: number;
  readonly hasSourceArrow: boolean;
  readonly hasTargetArrow: boolean;
}): string => {
  const pba: Point = params.hasSourceArrow
    ? createRotatedPoint(
        { x: params.arrowLength, y: zero.y },
        params.fromVect,
        zero,
      )
    : zero;
  const pea: Point = params.hasTargetArrow
    ? createRotatedPoint(
        { x: params.to.x - params.arrowLength, y: params.to.y },
        params.toVect,
        params.to,
      )
    : params.to;

  const gap = params.arrowLength + params.arrowOffset;

  const pbl = createRotatedPoint({ x: gap, y: zero.y }, params.fromVect, zero);
  const pel = createRotatedPoint(
    { x: params.to.x - gap, y: params.to.y },
    params.toVect,
    params.to,
  );

  return createRoundedPath([pba, pbl, pel, pea], params.roundness);
};
