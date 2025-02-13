import { Point, zero } from "@/point";
import { createRotatedPoint } from "../create-rotated-point";
import { createRoundedPath } from "../create-rounded-path";

export const createDetourStraightLinePath = (
  to: Point,
  fromVect: Point,
  toVect: Point,
  flipX: number,
  flipY: number,
  arrowLength: number,
  arrowOffset: number,
  roundness: number,
  detourX: number,
  detourY: number,
  hasSourceArrow: boolean,
  hasTargetArrow: boolean,
): string => {
  const pba: Point = hasSourceArrow
    ? createRotatedPoint({ x: arrowLength, y: zero.y }, fromVect, zero)
    : zero;
  const pea: Point = hasTargetArrow
    ? createRotatedPoint({ x: to.x - arrowLength, y: to.y }, toVect, to)
    : to;

  const gap1 = arrowLength + arrowOffset;

  const pbl1: Point = createRotatedPoint(
    { x: gap1, y: zero.y },
    fromVect,
    zero,
  );

  const flipDetourX = detourX * flipX;
  const flipDetourY = detourY * flipY;

  const pbl2: Point = { x: pbl1.x + flipDetourX, y: pbl1.y + flipDetourY };
  const pel1: Point = createRotatedPoint(
    { x: to.x - gap1, y: to.y },
    toVect,
    to,
  );
  const pel2: Point = { x: pel1.x + flipDetourX, y: pel1.y + flipDetourY };

  return createRoundedPath([pba, pbl1, pbl2, pel2, pel1, pea], roundness);
};
