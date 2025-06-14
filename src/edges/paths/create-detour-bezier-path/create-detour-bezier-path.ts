import { Point, zero } from "@/point";
import { createRotatedPoint } from "../../shared";

export const createDetourBezierPath = (params: {
  readonly to: Point;
  readonly fromVector: Point;
  readonly toVector: Point;
  readonly flipX: number;
  readonly flipY: number;
  readonly arrowLength: number;
  readonly detourDirection: number;
  readonly detourDistance: number;
  readonly curvature: number;
  readonly hasSourceArrow: boolean;
  readonly hasTargetArrow: boolean;
}): string => {
  const pba: Point = params.hasSourceArrow
    ? createRotatedPoint(
        { x: params.arrowLength, y: zero.y },
        params.fromVector,
        zero,
      )
    : zero;

  const pea: Point = params.hasTargetArrow
    ? createRotatedPoint(
        { x: params.to.x - params.arrowLength, y: params.to.y },
        params.toVector,
        params.to,
      )
    : params.to;

  const gap1 = params.arrowLength;

  const detourX = Math.cos(params.detourDirection) * params.detourDistance;
  const detourY = Math.sin(params.detourDirection) * params.detourDistance;

  const flipDetourX = detourX * params.flipX;
  const flipDetourY = detourY * params.flipY;

  const pbl1: Point = createRotatedPoint(
    { x: gap1, y: zero.y },
    params.fromVector,
    zero,
  );
  const pbl2: Point = {
    x: pbl1.x + flipDetourX,
    y: pbl1.y + flipDetourY,
  };
  const pel1: Point = createRotatedPoint(
    { x: params.to.x - gap1, y: params.to.y },
    params.toVector,
    params.to,
  );
  const pel2: Point = {
    x: pel1.x + flipDetourX,
    y: pel1.y + flipDetourY,
  };
  const pm: Point = { x: (pbl2.x + pel2.x) / 2, y: (pbl2.y + pel2.y) / 2 };
  const pbc1: Point = {
    x: pbl1.x + params.curvature * params.fromVector.x,
    y: pbl1.y + params.curvature * params.fromVector.y,
  };

  const pec1: Point = {
    x: pel1.x - params.curvature * params.toVector.x,
    y: pel1.y - params.curvature * params.toVector.y,
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
