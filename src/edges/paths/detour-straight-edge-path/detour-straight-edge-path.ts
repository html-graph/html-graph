import { Point } from "@/point";
import { createRotatedPoint, flipPoint } from "../../geometry";
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
    readonly flipX: number;
    readonly flipY: number;
    readonly arrowLength: number;
    readonly arrowOffset: number;
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
      flipX,
      flipY,
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

    const flipDetourX = detourX * flipX;
    const flipDetourY = detourY * flipY;

    const pbl2: Point = { x: pbl1.x + flipDetourX, y: pbl1.y + flipDetourY };
    const pel1: Point = createRotatedPoint(
      { x: to.x - gap, y: to.y },
      toDir,
      to,
    );
    const pel2: Point = { x: pel1.x + flipDetourX, y: pel1.y + flipDetourY };

    const center = { x: (pbl2.x + pel2.x) / 2, y: (pbl2.y + pel2.y) / 2 };

    this.midpoint = flipPoint(center, flipX, flipY, {
      x: from.x + to.x,
      y: from.y + to.y,
    });

    this.path = createRoundedPath(
      [pba, pbl1, pbl2, pel2, pel1, pea],
      roundness,
    );
  }
}
