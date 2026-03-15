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

    const pbl1: Point = createRotatedPoint(
      { x: from.x + gap, y: from.y },
      fromDir,
      from,
    );

    const detourX = Math.cos(detourDir) * detourDistance;
    const detourY = Math.sin(detourDir) * detourDistance;

    const pbl2: Point = { x: pbl1.x + detourX, y: pbl1.y + detourY };
    const pel1: Point = createRotatedPoint(
      { x: to.x - gap, y: to.y },
      toDir,
      to,
    );
    const pel2: Point = { x: pel1.x + detourX, y: pel1.y + detourY };

    const center = { x: (pbl2.x + pel2.x) / 2, y: (pbl2.y + pel2.y) / 2 };

    this.midpoint = center;

    this.path = createRoundedPath(
      [pba, pbl1, pbl2, pel2, pel1, pea],
      roundness,
    );
  }
}
