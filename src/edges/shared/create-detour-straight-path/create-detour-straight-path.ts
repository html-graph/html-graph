import { Point, zero } from "@/point";
import { createRotatedPoint } from "../create-rotated-point";
import { createRoundedPath } from "../create-rounded-path";

export const createDetourStraightPath = (params: {
  readonly to: Point;
  readonly sourceDirection: Point;
  readonly targetDirection: Point;
  readonly flipX: number;
  readonly flipY: number;
  readonly arrowLength: number;
  readonly arrowOffset: number;
  readonly roundness: number;
  readonly detourDirection: number;
  readonly detourDistance: number;
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

  const gap1 = params.arrowLength + params.arrowOffset;

  const pbl1: Point = createRotatedPoint(
    { x: gap1, y: zero.y },
    params.sourceDirection,
    zero,
  );

  const detourX = Math.cos(params.detourDirection) * params.detourDistance;
  const detourY = Math.sin(params.detourDirection) * params.detourDistance;

  const flipDetourX = detourX * params.flipX;
  const flipDetourY = detourY * params.flipY;

  const pbl2: Point = { x: pbl1.x + flipDetourX, y: pbl1.y + flipDetourY };
  const pel1: Point = createRotatedPoint(
    { x: params.to.x - gap1, y: params.to.y },
    params.targetDirection,
    params.to,
  );
  const pel2: Point = { x: pel1.x + flipDetourX, y: pel1.y + flipDetourY };

  return createRoundedPath(
    [pba, pbl1, pbl2, pel2, pel1, pea],
    params.roundness,
  );
};
