import { Point } from "@/point";
import { createRotatedPoint } from "../../geometry";
import { EdgePath } from "../edge-path";
import { createRoundedPath } from "../../svg";

export class DetourStraightEdgePath implements EdgePath {
  public readonly path: string;

  public readonly midpoint: Point;

  public constructor(params: {
    readonly from: Point;
    readonly to: Point;
    readonly fromDir: Point;
    readonly toDir: Point;
    readonly arrowOffset: number;
    readonly arrowLength: number;
    readonly roundness: number;
    readonly detourDir: number;
    readonly detourDistance: number;
    readonly hasSourceArrow: boolean;
    readonly hasTargetArrow: boolean;
  }) {
    const {
      hasSourceArrow,
      hasTargetArrow,
      from,
      to,
      arrowLength,
      fromDir,
      toDir,
      arrowOffset,
      detourDir,
      detourDistance,
      roundness,
    } = params;

    const pba: Point = hasSourceArrow
      ? createRotatedPoint(
          { x: from.x + arrowLength, y: from.y },
          fromDir,
          from,
        )
      : from;

    const pea: Point = hasTargetArrow
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

    const detourX = Math.cos(detourDir) * detourDistance;
    const detourY = Math.sin(detourDir) * detourDistance;

    const startLineStart: Point = createRotatedPoint(
      { x: from.x + gap, y: from.y },
      fromDir,
      from,
    );

    const startLineEnd: Point = {
      x: startLineStart.x + detourX,
      y: startLineStart.y + detourY,
    };

    const endLineStart: Point = createRotatedPoint(
      { x: to.x - gap, y: to.y },
      toDir,
      to,
    );

    const endLineEnd: Point = {
      x: endLineStart.x + detourX,
      y: endLineStart.y + detourY,
    };

    this.midpoint = {
      x: (startLineEnd.x + endLineEnd.x) / 2,
      y: (startLineEnd.y + endLineEnd.y) / 2,
    };

    this.path = createRoundedPath(
      [pba, startLineStart, startLineEnd, endLineEnd, endLineStart, pea],
      roundness,
    );
  }
}
