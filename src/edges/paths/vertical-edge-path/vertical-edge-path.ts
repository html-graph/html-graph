import { Point } from "@/point";
import { createRotatedPoint } from "../../geometry";
import { EdgePath } from "../edge-path";
import { createRoundedPath } from "../../svg";

export class VerticalEdgePath implements EdgePath {
  public readonly path: string;

  public readonly midpoint: Point;

  public constructor(params: {
    readonly from: Point;
    readonly to: Point;
    readonly fromDir: Point;
    readonly toDir: Point;
    readonly arrowLength: number;
    readonly arrowOffset: number;
    readonly roundness: number;
    readonly hasSourceArrow: boolean;
    readonly hasTargetArrow: boolean;
  }) {
    const {
      from,
      to,
      hasSourceArrow,
      hasTargetArrow,
      arrowLength,
      arrowOffset,
      fromDir,
      toDir,
      roundness,
    } = params;

    const beginArrow: Point = hasSourceArrow
      ? createRotatedPoint(
          { x: from.x + arrowLength, y: from.y },
          fromDir,
          from,
        )
      : from;

    const endArrow: Point = hasTargetArrow
      ? createRotatedPoint(
          {
            x: to.x - arrowLength,
            y: to.y,
          },
          toDir,
          to,
        )
      : to;

    const gap = arrowLength + arrowOffset;
    const gapRoundness = gap - roundness;

    const beginLine = createRotatedPoint(
      { x: from.x + gapRoundness, y: from.y },
      fromDir,
      from,
    );

    const endLine = createRotatedPoint(
      { x: to.x - gapRoundness, y: to.y },
      toDir,
      to,
    );

    const isTopToBottom = to.y > from.y;
    const halfWidth = (beginLine.x + endLine.x) / 2;
    const halfHeight = Math.max((beginLine.y + endLine.y) / 2, gap);

    const begin1: Point = {
      x: beginLine.x,
      y: isTopToBottom ? halfHeight : from.y + gap,
    };

    const begin2: Point = { x: halfWidth, y: begin1.y };

    const end1: Point = {
      x: endLine.x,
      y: isTopToBottom ? to.y - halfHeight : -gap,
    };

    const end2: Point = { x: halfWidth, y: end1.y };

    this.midpoint = { x: halfWidth, y: halfHeight };

    this.path = createRoundedPath(
      [beginArrow, beginLine, begin1, begin2, end2, end1, endLine, endArrow],
      roundness,
    );
  }
}
