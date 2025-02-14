import { Point, zero } from "@/point";
import { createRotatedPoint } from "../create-rotated-point";

export const createNodeCyclePath = (
  to: Point,
  fromVect: Point,
  toVect: Point,
  flipX: number,
  flipY: number,
  arrowLength: number,
  detourX: number,
  detourY: number,
  curvature: number,
  hasSourceArrow: boolean,
  hasTargetArrow: boolean,
): string => {
  const pba: Point = hasSourceArrow
    ? createRotatedPoint({ x: arrowLength, y: zero.y }, fromVect, zero)
    : zero;

  const pea: Point = hasTargetArrow
    ? createRotatedPoint({ x: to.x - arrowLength, y: to.y }, toVect, to)
    : to;

  const gap1 = arrowLength;
  const flipDetourX = detourX * flipX;
  const flipDetourY = detourY * flipY;

  const pbl1: Point = createRotatedPoint(
    { x: gap1, y: zero.y },
    fromVect,
    zero,
  );
  const pbl2: Point = {
    x: pbl1.x + flipDetourX,
    y: pbl1.y + flipDetourY,
  };
  const pel1: Point = createRotatedPoint(
    { x: to.x - gap1, y: to.y },
    toVect,
    to,
  );
  const pel2: Point = {
    x: pel1.x + flipDetourX,
    y: pel1.y + flipDetourY,
  };
  const pm: Point = { x: (pbl2.x + pel2.x) / 2, y: (pbl2.y + pel2.y) / 2 };
  const pbc1: Point = {
    x: pbl1.x + curvature * fromVect.x,
    y: pbl1.y + curvature * fromVect.y,
  };

  const pec1: Point = {
    x: pel1.x - curvature * toVect.x,
    y: pel1.y - curvature * toVect.y,
  };

  const pbc2: Point = {
    x: pbl1.x + flipDetourX,
    y: pbl1.y + flipDetourY,
  };
  const pec2: Point = {
    x: pel1.x + flipDetourX,
    y: pel1.y + flipDetourY,
  };

  return [
    `M ${pba.x} ${pba.y}`,
    `L ${pbl1.x} ${pbl1.y}`,
    `C ${pbc1.x} ${pbc1.y} ${pbc2.x} ${pbc2.y} ${pm.x} ${pm.y}`,
    `C ${pec2.x} ${pec2.y} ${pec1.x} ${pec1.y} ${pel1.x} ${pel1.y}`,
    `L ${pea.x} ${pea.y}`,
  ].join(" ");
};
