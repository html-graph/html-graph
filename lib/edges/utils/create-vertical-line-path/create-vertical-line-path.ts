import { Point, zero } from "@/point";
import { createRotatedPoint } from "../create-rotated-point";
import { createRoundedPath } from "../create-rounded-path";

export const createVerticalLinePath = (params: {
  readonly to: Point;
  readonly fromVect: Point;
  readonly toVect: Point;
  readonly flipY: number;
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
  const gapr = gap - params.roundness;

  const pbl = createRotatedPoint({ x: gapr, y: zero.y }, params.fromVect, zero);
  const pel = createRotatedPoint(
    { x: params.to.x - gapr, y: params.to.y },
    params.toVect,
    params.to,
  );

  const halfH = Math.max((pbl.y + pel.y) / 2, gap);
  const halfW = params.to.x / 2;
  const pb1: Point = { x: pbl.x, y: params.flipY > 0 ? halfH : -gap };
  const pb2: Point = { x: halfW, y: pb1.y };
  const pe1: Point = {
    x: pel.x,
    y: params.flipY > 0 ? params.to.y - halfH : params.to.y + gap,
  };
  const pe2: Point = { x: halfW, y: pe1.y };

  return createRoundedPath(
    [pba, pbl, pb1, pb2, pe2, pe1, pel, pea],
    params.roundness,
  );
};
