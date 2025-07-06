import { Point, zero } from "@/point";
import { createRotatedPoint } from "../create-rotated-point";
import { createRoundedPath } from "../create-rounded-path";

export const createVerticalLinePath = (params: {
  readonly to: Point;
  readonly sourceDirection: Point;
  readonly targetDirection: Point;
  readonly flipY: number;
  readonly arrowLength: number;
  readonly arrowOffset: number;
  readonly roundness: number;
  readonly hasSourceArrow: boolean;
  readonly hasTargetArrow: boolean;
}): string => {
  const beginArrow: Point = params.hasSourceArrow
    ? createRotatedPoint(
        { x: params.arrowLength, y: zero.y },
        params.sourceDirection,
        zero,
      )
    : zero;
  const endArrow: Point = params.hasTargetArrow
    ? createRotatedPoint(
        { x: params.to.x - params.arrowLength, y: params.to.y },
        params.targetDirection,
        params.to,
      )
    : params.to;

  const gap = params.arrowLength + params.arrowOffset;
  const gapRoundness = gap - params.roundness;

  const beginLine = createRotatedPoint(
    { x: gapRoundness, y: zero.y },
    params.sourceDirection,
    zero,
  );
  const endLine = createRotatedPoint(
    { x: params.to.x - gapRoundness, y: params.to.y },
    params.targetDirection,
    params.to,
  );

  const halfHeight = Math.max((beginLine.y + endLine.y) / 2, gap);
  const halfWidth = params.to.x / 2;

  const begin1: Point = {
    x: beginLine.x,
    y: params.flipY > 0 ? halfHeight : -gap,
  };
  const begin2: Point = { x: halfWidth, y: begin1.y };

  const end1: Point = {
    x: endLine.x,
    y: params.flipY > 0 ? params.to.y - halfHeight : params.to.y + gap,
  };
  const end2: Point = { x: halfWidth, y: end1.y };

  return createRoundedPath(
    [beginArrow, beginLine, begin1, begin2, end2, end1, endLine, endArrow],
    params.roundness,
  );
};
