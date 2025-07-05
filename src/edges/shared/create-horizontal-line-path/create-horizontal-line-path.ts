import { Point, zero } from "@/point";
import { createRotatedPoint } from "../create-rotated-point";
import { createRoundedPath } from "../create-rounded-path";

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
  const beginArrow: Point = params.hasSourceArrow
    ? createRotatedPoint(
        { x: params.arrowLength, y: zero.y },
        params.fromVector,
        zero,
      )
    : zero;
  const endArrow: Point = params.hasTargetArrow
    ? createRotatedPoint(
        { x: params.to.x - params.arrowLength, y: params.to.y },
        params.toVector,
        params.to,
      )
    : params.to;

  const gap = params.arrowLength + params.arrowOffset;
  const gapRoundness = gap - params.roundness;

  const beginLine = createRotatedPoint(
    { x: gapRoundness, y: zero.y },
    params.fromVector,
    zero,
  );

  const endLine = createRotatedPoint(
    { x: params.to.x - gapRoundness, y: params.to.y },
    params.toVector,
    params.to,
  );

  const halfWidth = Math.max((beginLine.x + endLine.x) / 2, gap);
  const halfHeight = params.to.y / 2;

  const begin1: Point = {
    x: params.flipX > 0 ? halfWidth : -gap,
    y: beginLine.y,
  };
  const begin2: Point = { x: begin1.x, y: halfHeight };

  const end1: Point = {
    x: params.flipX > 0 ? params.to.x - halfWidth : params.to.x + gap,
    y: endLine.y,
  };
  const end2: Point = { x: end1.x, y: halfHeight };

  return createRoundedPath(
    [beginArrow, beginLine, begin1, begin2, end2, end1, endLine, endArrow],
    params.roundness,
  );
};
