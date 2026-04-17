import { Point } from "@/point";
import { createRotatedPoint } from "../../geometry";
import { EdgePath } from "../edge-path";
import { createRoundedPath } from "../../svg";
import { createLine } from "./create-line";

export class HorizontalEdgePath implements EdgePath {
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
      fromDir,
      toDir,
      arrowLength,
      arrowOffset,
      roundness,
      hasSourceArrow,
      hasTargetArrow,
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

    const beginLine = createRotatedPoint(
      { x: from.x + gap, y: from.y },
      fromDir,
      from,
    );

    const endLine = createRotatedPoint({ x: to.x - gap, y: to.y }, toDir, to);

    const line = createLine(
      {
        arrowPoint: beginArrow,
        linePoint: beginLine,
        dirX: fromDir.x,
      },
      {
        arrowPoint: endArrow,
        linePoint: endLine,
        dirX: toDir.x,
      },
    );

    this.path = createRoundedPath(line.points, roundness);

    this.midpoint = line.midpoint;
  }
}
