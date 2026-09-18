import { Point } from "@/point";
import { createRotatedPoint } from "../../geometry";
import { EdgePath } from "../edge-path";
import { createRoundedPath } from "../../svg";
import { calculateDotourY } from "./calculate-detour-y";
import { EdgePort } from "@/edges/shapes/path-edge-shape";

export class DetourHorizontalEdgePath implements EdgePath {
  public readonly path: string;

  public readonly midpoint: Point;

  public constructor(params: {
    readonly from: EdgePort;
    readonly to: EdgePort;
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
      arrowOffset,
      roundness,
      detourDistance,
    } = params;

    const beginArrow: Point = hasSourceArrow
      ? createRotatedPoint(
          { x: from.coords.x + arrowLength, y: from.coords.y },
          from.dir,
          from.coords,
        )
      : from.coords;

    const endArrow: Point = hasTargetArrow
      ? createRotatedPoint(
          {
            x: to.coords.x - arrowLength,
            y: to.coords.y,
          },
          to.dir,
          to.coords,
        )
      : to.coords;

    const gap = arrowLength + arrowOffset;

    const lineBegin: Point = createRotatedPoint(
      { x: from.coords.x + gap, y: from.coords.y },
      from.dir,
      from.coords,
    );

    const lineEnd: Point = createRotatedPoint(
      { x: to.coords.x - gap, y: to.coords.y },
      to.dir,
      to.coords,
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
