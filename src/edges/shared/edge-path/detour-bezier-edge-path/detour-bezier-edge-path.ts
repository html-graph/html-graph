import { Point, zero } from "@/point";
import { createRotatedPoint } from "../../create-rotated-point";
import { EdgePath } from "../edge-path";
import { flipPoint } from "../../flip-point";

export class DetourBezierEdgePath implements EdgePath {
  public readonly path: string;

  public readonly midpoint: Point;

  public constructor(
    private readonly params: {
      readonly to: Point;
      readonly sourceDirection: Point;
      readonly targetDirection: Point;
      readonly flipX: number;
      readonly arrowLength: number;
      readonly detourDirection: number;
      readonly flipY: number;
      readonly detourDistance: number;
      readonly curvature: number;
      readonly hasSourceArrow: boolean;
      readonly hasTargetArrow: boolean;
    },
  ) {
    const beginArrow: Point = this.params.hasSourceArrow
      ? createRotatedPoint(
          { x: this.params.arrowLength, y: zero.y },
          this.params.sourceDirection,
          zero,
        )
      : zero;

    const endArrow: Point = this.params.hasTargetArrow
      ? createRotatedPoint(
          {
            x: this.params.to.x - this.params.arrowLength,
            y: this.params.to.y,
          },
          this.params.targetDirection,
          this.params.to,
        )
      : this.params.to;

    const gap = this.params.arrowLength;

    const detourX =
      Math.cos(this.params.detourDirection) * this.params.detourDistance;
    const detourY =
      Math.sin(this.params.detourDirection) * this.params.detourDistance;

    const flipDetourX = detourX * this.params.flipX;
    const flipDetourY = detourY * this.params.flipY;

    const beginLine1: Point = createRotatedPoint(
      { x: gap, y: zero.y },
      this.params.sourceDirection,
      zero,
    );
    const beginLine2: Point = {
      x: beginLine1.x + flipDetourX,
      y: beginLine1.y + flipDetourY,
    };
    const endLine1: Point = createRotatedPoint(
      { x: this.params.to.x - gap, y: this.params.to.y },
      this.params.targetDirection,
      this.params.to,
    );
    const endLine2: Point = {
      x: endLine1.x + flipDetourX,
      y: endLine1.y + flipDetourY,
    };

    const center: Point = {
      x: (beginLine2.x + endLine2.x) / 2,
      y: (beginLine2.y + endLine2.y) / 2,
    };

    const beginCurve1: Point = {
      x: beginLine1.x + this.params.curvature * this.params.sourceDirection.x,
      y: beginLine1.y + this.params.curvature * this.params.sourceDirection.y,
    };

    const endCurve1: Point = {
      x: endLine1.x - this.params.curvature * this.params.targetDirection.x,
      y: endLine1.y - this.params.curvature * this.params.targetDirection.y,
    };

    const beginCurve2: Point = {
      x: beginLine1.x + flipDetourX,
      y: beginLine1.y + flipDetourY,
    };
    const endCurve2: Point = {
      x: endLine1.x + flipDetourX,
      y: endLine1.y + flipDetourY,
    };

    this.path = [
      `M ${beginArrow.x} ${beginArrow.y}`,
      `L ${beginLine1.x} ${beginLine1.y}`,
      `C ${beginCurve1.x} ${beginCurve1.y} ${beginCurve2.x} ${beginCurve2.y} ${center.x} ${center.y}`,
      `C ${endCurve2.x} ${endCurve2.y} ${endCurve1.x} ${endCurve1.y} ${endLine1.x} ${endLine1.y}`,
      `L ${endArrow.x} ${endArrow.y}`,
    ].join(" ");

    this.midpoint = flipPoint(center, params.flipX, params.flipY, params.to);
  }
}
