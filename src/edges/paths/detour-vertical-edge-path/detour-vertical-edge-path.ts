import { Point } from "@/point";
import { createRotatedPoint } from "../../geometry";
import { EdgePath } from "../edge-path";
import { createRoundedPath } from "../../svg";
import { calculateDetourX } from "./calculate-detour-x";

export class DetourVerticalEdgePath implements EdgePath {
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
    readonly detourDistance: number;
    readonly hasSourceArrow: boolean;
    readonly hasTargetArrow: boolean;
  }) {
    const {
      hasSourceArrow,
      hasTargetArrow,
      arrowLength,
      fromDir,
      toDir,
      from,
      to,
      arrowOffset,
      detourDistance,
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

    const lineBegin: Point = createRotatedPoint(
      { x: from.x + gap, y: from.y },
      fromDir,
      from,
    );

    const lineEnd: Point = createRotatedPoint(
      { x: to.x - gap, y: to.y },
      toDir,
      to,
    );

    const detourX = calculateDetourX(lineBegin, lineEnd, detourDistance);

    this.midpoint = {
      x: detourX,
      y: (lineBegin.y + lineEnd.y) / 2,
    };

    this.path = createRoundedPath(
      [
        beginArrow,
        lineBegin,
        { x: detourX, y: lineBegin.y },
        { x: detourX, y: lineEnd.y },
        lineEnd,
        endArrow,
      ],
      roundness,
    );
  }
}
