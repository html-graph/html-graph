import { Point } from "@/point";
import { createRotatedPoint } from "../../geometry";
import { EdgePath } from "../edge-path";

export class DetourBezierEdgePath implements EdgePath {
  public readonly path: string;

  public readonly midpoint: Point;

  public constructor(params: {
    readonly from: Point;
    readonly to: Point;
    readonly fromDir: Point;
    readonly toDir: Point;
    readonly arrowLength: number;
    readonly detourDir: number;
    readonly detourDistance: number;
    readonly curvature: number;
    readonly hasSourceArrow: boolean;
    readonly hasTargetArrow: boolean;
  }) {
    const {
      hasSourceArrow,
      hasTargetArrow,
      curvature,
      fromDir,
      toDir,
      detourDir,
      from,
      to,
      arrowLength,
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

    const detourX = Math.cos(detourDir) * detourDistance;
    const detourY = Math.sin(detourDir) * detourDistance;

    const beginLine1: Point = createRotatedPoint(
      { x: from.x + arrowLength, y: from.y },
      fromDir,
      from,
    );

    const beginLine2: Point = {
      x: beginLine1.x + detourX,
      y: beginLine1.y + detourY,
    };

    const endLine1: Point = createRotatedPoint(
      { x: to.x - arrowLength, y: to.y },
      toDir,
      to,
    );

    const endLine2: Point = {
      x: endLine1.x + detourX,
      y: endLine1.y + detourY,
    };

    const center: Point = {
      x: (beginLine2.x + endLine2.x) / 2,
      y: (beginLine2.y + endLine2.y) / 2,
    };

    const beginCurve1: Point = {
      x: beginLine1.x + curvature * fromDir.x,
      y: beginLine1.y + curvature * fromDir.y,
    };

    const endCurve1: Point = {
      x: endLine1.x - curvature * toDir.x,
      y: endLine1.y - curvature * toDir.y,
    };

    const beginCurve2: Point = {
      x: beginLine1.x + detourX,
      y: beginLine1.y + detourY,
    };

    const endCurve2: Point = {
      x: endLine1.x + detourX,
      y: endLine1.y + detourY,
    };

    this.path = [
      `M ${beginArrow.x} ${beginArrow.y}`,
      `L ${beginLine1.x} ${beginLine1.y}`,
      `C ${beginCurve1.x} ${beginCurve1.y} ${beginCurve2.x} ${beginCurve2.y} ${center.x} ${center.y}`,
      `C ${endCurve2.x} ${endCurve2.y} ${endCurve1.x} ${endCurve1.y} ${endLine1.x} ${endLine1.y}`,
      `L ${endArrow.x} ${endArrow.y}`,
    ].join(" ");

    this.midpoint = center;
  }
}
