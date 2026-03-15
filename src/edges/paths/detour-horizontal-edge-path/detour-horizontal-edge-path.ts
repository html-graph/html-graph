import { Point } from "@/point";
import { createRotatedPoint } from "../../geometry";
import { EdgePath } from "../edge-path";
import { createRoundedPath } from "../../svg";

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

    const beginLine1: Point = createRotatedPoint(
      { x: from.x + gap, y: from.y },
      fromDir,
      from,
    );

    const endLine1: Point = createRotatedPoint(
      { x: to.x - gap, y: to.y },
      toDir,
      to,
    );

    const flipDetour = detourDistance > 0 ? 1 : -1;
    const halfHeight = (from.y + to.y) / 2;
    const centerDetour = halfHeight + Math.abs(detourDistance);
    const sideY = halfHeight + centerDetour * flipDetour;

    const center = {
      x: (beginLine1.x + endLine1.x) / 2,
      y: sideY,
    };

    this.midpoint = center;

    this.path = createRoundedPath(
      [
        beginArrow,
        beginLine1,
        { x: beginLine1.x, y: sideY },
        { x: endLine1.x, y: sideY },
        endLine1,
        endArrow,
      ],
      roundness,
    );
  }
}
