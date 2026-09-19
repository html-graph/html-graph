import { Point } from "@/point";
import { createRotatedPoint } from "../../geometry";
import { EdgePath } from "../edge-path";
import { createRoundedPath } from "../../svg";
import { PathPort } from "../../path-port";

export class StraightEdgePath implements EdgePath {
  public readonly path: string;

  public readonly midpoint: Point;

  public constructor(params: {
    readonly from: PathPort;
    readonly to: PathPort;
    readonly arrowLength: number;
    readonly arrowOffset: number;
    readonly roundness: number;
  }) {
    const { from, to, arrowLength, arrowOffset, roundness } = params;

    const beginArrow: Point = this.createArrowPoint(
      from.hasArrow,
      from.dir,
      from.coords,
      arrowLength,
    );

    const endArrow: Point = this.createArrowPoint(
      to.hasArrow,
      to.dir,
      to.coords,
      -arrowLength,
    );

    const gap = arrowLength + arrowOffset;

    const beginGap: Point = { x: from.coords.x + gap, y: from.coords.y };
    const beginLine = createRotatedPoint(beginGap, from.dir, from.coords);

    const endGap: Point = { x: to.coords.x - gap, y: to.coords.y };
    const endLine = createRotatedPoint(endGap, to.dir, to.coords);

    this.path = createRoundedPath(
      [beginArrow, beginLine, endLine, endArrow],
      roundness,
    );

    const centerX = (beginLine.x + endLine.x) / 2;
    const centerY = (beginLine.y + endLine.y) / 2;

    this.midpoint = { x: centerX, y: centerY };
  }

  private createArrowPoint(
    hasArrow: boolean,
    dir: Point,
    shift: Point,
    offsetLength: number,
  ): Point {
    if (!hasArrow) {
      return shift;
    }

    const offsetPoint: Point = {
      x: shift.x + offsetLength,
      y: shift.y,
    };

    return createRotatedPoint(offsetPoint, dir, shift);
  }
}
