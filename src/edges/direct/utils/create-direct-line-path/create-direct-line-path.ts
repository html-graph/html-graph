import { Point, zero } from "@/point";
import { createDirectLinePoint } from "../create-direct-line-point";

export const createDirectLinePath = (params: {
  readonly diagonalDistance: number;
  readonly to: Point;
  readonly sourceOffset: number;
  readonly targetOffset: number;
  readonly hasSourceArrow: boolean;
  readonly hasTargetArrow: boolean;
  readonly arrowLength: number;
}): string => {
  const source = createDirectLinePoint({
    diagonalDistance: params.diagonalDistance,
    to: params.to,
    offset: params.sourceOffset,
    hasArrow: params.hasSourceArrow,
    flip: 1,
    shift: zero,
    arrowLength: params.arrowLength,
  });

  const target = createDirectLinePoint({
    diagonalDistance: params.diagonalDistance,
    to: params.to,
    offset: params.targetOffset,
    hasArrow: params.hasTargetArrow,
    flip: -1,
    shift: params.to,
    arrowLength: params.arrowLength,
  });

  return `M ${source.x} ${source.y} L ${target.x} ${target.y}`;
};
