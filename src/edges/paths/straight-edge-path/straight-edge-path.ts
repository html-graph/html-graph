import { Point } from "@/point";
import { createRotatedPoint } from "../../geometry";
import { EdgePath } from "../edge-path";
import { createRoundedPath } from "../../svg";

export class StraightEdgePath implements EdgePath {
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
      fromDir,
      toDir,
      arrowOffset,
      roundness,
    } = params;

    const beginArrow: Point = this.createArrowPoint(
      hasSourceArrow,
      fromDir,
      from,
      arrowLength,
    );

    const endArrow: Point = this.createArrowPoint(
      hasTargetArrow,
      toDir,
      to,
      -arrowLength,
    );

    const gap = arrowLength + arrowOffset;

    const beginGap: Point = { x: from.x + gap, y: from.y };
    const beginLine = createRotatedPoint(beginGap, fromDir, from);

    const endGap: Point = { x: to.x - gap, y: to.y };
    const endLine = createRotatedPoint(endGap, toDir, to);

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
