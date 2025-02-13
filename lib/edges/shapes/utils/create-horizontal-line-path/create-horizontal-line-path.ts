import { Point, zero } from "@/point";
import { createRotatedPoint } from "../create-rotated-point";
import { createRoundedPath } from "../create-rounded-path";

export const createHorizontalLinePath = (
  to: Point,
  fromVect: Point,
  toVect: Point,
  flipX: number,
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
  const gapr = gap - roundness;

  const pbl = createRotatedPoint({ x: gapr, y: zero.y }, fromVect, zero);
  const pel = createRotatedPoint({ x: to.x - gapr, y: to.y }, toVect, to);
  const halfW = Math.max((pbl.x + pel.x) / 2, gap);
  const halfH = to.y / 2;
  const pb1: Point = { x: flipX > 0 ? halfW : -gap, y: pbl.y };
  const pb2: Point = { x: pb1.x, y: halfH };
  const pe1: Point = { x: flipX > 0 ? to.x - halfW : to.x + gap, y: pel.y };
  const pe2: Point = { x: pe1.x, y: halfH };

  return createRoundedPath([pba, pbl, pb1, pb2, pe2, pe1, pel, pea], roundness);
};
