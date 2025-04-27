import { Point, zero } from "@/point";
import { createRotatedPoint, createRoundedPath } from "../../utils";

export const createHorizontalLinePath = (params: {
  readonly to: Point;
  readonly fromVector: Point;
  readonly toVector: Point;
  readonly flipX: number;
  readonly arrowLength: number;
  readonly arrowOffset: number;
  readonly roundness: number;
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

  const gap = params.arrowLength + params.arrowOffset;
  const gapr = gap - params.roundness;

  const pbl = createRotatedPoint(
    { x: gapr, y: zero.y },
    params.fromVector,
    zero,
  );
  const pel = createRotatedPoint(
    { x: params.to.x - gapr, y: params.to.y },
    params.toVector,
    params.to,
  );
  const halfW = Math.max((pbl.x + pel.x) / 2, gap);
  const halfH = params.to.y / 2;
  const pb1: Point = { x: params.flipX > 0 ? halfW : -gap, y: pbl.y };
  const pb2: Point = { x: pb1.x, y: halfH };
  const pe1: Point = {
    x: params.flipX > 0 ? params.to.x - halfW : params.to.x + gap,
    y: pel.y,
  };
  const pe2: Point = { x: pe1.x, y: halfH };

  return createRoundedPath(
    [pba, pbl, pb1, pb2, pe2, pe1, pel, pea],
    params.roundness,
  );
};
