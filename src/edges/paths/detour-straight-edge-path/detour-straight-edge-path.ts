import { Point } from "@/point";
import { createRotatedPoint } from "../../geometry";
import { EdgePath } from "../edge-path";
import { createRoundedPath } from "../../svg";
import { PathPort } from "../../path-port";

export class DetourStraightEdgePath implements EdgePath {
  public readonly path: string;

  public readonly midpoint: Point;

  public constructor(params: {
    readonly from: PathPort;
    readonly to: PathPort;
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
      arrowOffset,
      detourDir,
      detourDistance,
      roundness,
    } = params;

    const pba: Point = hasSourceArrow
      ? createRotatedPoint(
          { x: from.coords.x + arrowLength, y: from.coords.y },
          from.dir,
          from.coords,
        )
      : from.coords;

    const pea: Point = hasTargetArrow
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

    const detourX = Math.cos(detourDir) * detourDistance;
    const detourY = Math.sin(detourDir) * detourDistance;

    const startLineStart: Point = createRotatedPoint(
      { x: from.coords.x + gap, y: from.coords.y },
      from.dir,
      from.coords,
    );

    const startLineEnd: Point = {
      x: startLineStart.x + detourX,
      y: startLineStart.y + detourY,
    };

    const endLineStart: Point = createRotatedPoint(
      { x: to.coords.x - gap, y: to.coords.y },
      to.dir,
      to.coords,
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
