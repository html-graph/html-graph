import { Point } from "@/point";
import { createRotatedPoint } from "../../geometry";
import { EdgePath } from "../edge-path";
import { createRoundedPath } from "../../svg";
import { calculateDetourX } from "./calculate-detour-x";
import { PathPort } from "../../path-port";

export class DetourVerticalEdgePath implements EdgePath {
  public readonly path: string;

  public readonly midpoint: Point;

  public constructor(params: {
    readonly from: PathPort;
    readonly to: PathPort;
    readonly arrowLength: number;
    readonly arrowOffset: number;
    readonly roundness: number;
    readonly detourDistance: number;
  }) {
    const { from, to, arrowLength, arrowOffset, detourDistance, roundness } =
      params;

    const beginArrow: Point = from.hasArrow
      ? createRotatedPoint(
          { x: from.coords.x + arrowLength, y: from.coords.y },
          from.dir,
          from.coords,
        )
      : from.coords;

    const endArrow: Point = to.hasArrow
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
