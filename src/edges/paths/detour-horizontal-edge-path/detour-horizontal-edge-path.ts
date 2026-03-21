import { Point } from "@/point";
import { createRotatedPoint } from "../../geometry";
import { EdgePath } from "../edge-path";
import { createRoundedPath } from "../../svg";
import { calculateDotourY } from "./calculate-detour-y";

export class DetourHorizontalEdgePath implements EdgePath {
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
      from,
      to,
      fromDir,
      toDir,
      arrowOffset,
      roundness,
      detourDistance,
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

    const detourY = calculateDotourY(lineBegin, lineEnd, detourDistance);

    this.midpoint = {
      x: (lineBegin.x + lineEnd.x) / 2,
      y: detourY,
    };

    this.path = createRoundedPath(
      [
        beginArrow,
        lineBegin,
        { x: lineBegin.x, y: detourY },
        { x: lineEnd.x, y: detourY },
        lineEnd,
        endArrow,
      ],
      roundness,
    );
  }
}
