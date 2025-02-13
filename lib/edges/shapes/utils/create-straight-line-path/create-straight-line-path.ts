import { Point, zero } from "@/point";
import { createRotatedPoint } from "../create-rotated-point";
import { createRoundedPath } from "../create-rounded-path";

export const createStraightLinePath = (
  to: Point,
  fromVect: Point,
  toVect: Point,
  arrowLength: number,
  arrowOffset: number,
  roundness: number,
  hasSourceArrow: boolean,
  hasTargetArrow: boolean,
): string => {
  const pba: Point = hasSourceArrow
    ? createRotatedPoint({ x: arrowLength, y: zero.y }, fromVect, zero)
    : zero;
  const pea: Point = hasTargetArrow
    ? createRotatedPoint({ x: to.x - arrowLength, y: to.y }, toVect, to)
    : to;

  const gap = arrowLength + arrowOffset;

  const pbl = createRotatedPoint({ x: gap, y: zero.y }, fromVect, zero);
  const pel = createRotatedPoint({ x: to.x - gap, y: to.y }, toVect, to);

  return createRoundedPath([pba, pbl, pel, pea], roundness);
};
