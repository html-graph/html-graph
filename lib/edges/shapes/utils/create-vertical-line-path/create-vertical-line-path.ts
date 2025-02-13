import { Point, zero } from "@/point";
import { createRotatedPoint } from "../create-rotated-point";
import { createRoundedPath } from "../create-rounded-path";

export const createVerticalLinePath = (
  to: Point,
  fromVect: Point,
  toVect: Point,
  flipY: number,
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

  const halfH = Math.max((pbl.y + pel.y) / 2, gap);
  const halfW = to.x / 2;
  const pb1: Point = { x: pbl.x, y: flipY > 0 ? halfH : -gap };
  const pb2: Point = { x: halfW, y: pb1.y };
  const pe1: Point = {
    x: pel.x,
    y: flipY > 0 ? to.y - halfH : to.y + gap,
  };
  const pe2: Point = { x: halfW, y: pe1.y };

  return createRoundedPath([pba, pbl, pb1, pb2, pe2, pe1, pel, pea], roundness);
};
