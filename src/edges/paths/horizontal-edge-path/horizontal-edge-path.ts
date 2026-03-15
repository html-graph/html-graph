import { Point } from "@/point";
import { createRotatedPoint } from "../../geometry";
import { EdgePath } from "../edge-path";
import { createRoundedPath } from "../../svg";

export class HorizontalEdgePath implements EdgePath {
  public readonly path: string;

  public readonly midpoint: Point;

  public constructor(params: {
    readonly from: Point;
    readonly to: Point;
    readonly fromDir: Point;
    readonly toDir: Point;
    readonly flipX: number;
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
      flipX,
    } = params;

    this.midpoint = { x: (from.x + to.x) / 2, y: (from.y + to.y) / 2 };

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

    const halfWidth = Math.max((beginLine.x + endLine.x) / 2, gap);
    const halfHeight = (from.y + to.y) / 2;

    const begin1: Point = {
      x: flipX > 0 ? halfWidth : -gap,
      y: beginLine.y,
    };

    const begin2: Point = { x: begin1.x, y: halfHeight };

    const end1: Point = {
      x: flipX > 0 ? to.x - halfWidth : to.x + gap,
      y: endLine.y,
    };
    const end2: Point = { x: end1.x, y: halfHeight };

    this.path = createRoundedPath(
      [beginArrow, beginLine, begin1, begin2, end2, end1, endLine, endArrow],
      roundness,
    );
  }
}
