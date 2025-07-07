import { Point, zero } from "@/point";
import { createRotatedPoint } from "../../create-rotated-point";
import { ConnectionLine } from "../connection-line";

export class DetoutBezierLine implements ConnectionLine {
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
  ) {}

  public getPath(): string {
    const pba: Point = this.params.hasSourceArrow
      ? createRotatedPoint(
          { x: this.params.arrowLength, y: zero.y },
          this.params.sourceDirection,
          zero,
        )
      : zero;

    const pea: Point = this.params.hasTargetArrow
      ? createRotatedPoint(
          {
            x: this.params.to.x - this.params.arrowLength,
            y: this.params.to.y,
          },
          this.params.targetDirection,
          this.params.to,
        )
      : this.params.to;

    const gap1 = this.params.arrowLength;

    const detourX =
      Math.cos(this.params.detourDirection) * this.params.detourDistance;
    const detourY =
      Math.sin(this.params.detourDirection) * this.params.detourDistance;

    const flipDetourX = detourX * this.params.flipX;
    const flipDetourY = detourY * this.params.flipY;

    const pbl1: Point = createRotatedPoint(
      { x: gap1, y: zero.y },
      this.params.sourceDirection,
      zero,
    );
    const pbl2: Point = {
      x: pbl1.x + flipDetourX,
      y: pbl1.y + flipDetourY,
    };
    const pel1: Point = createRotatedPoint(
      { x: this.params.to.x - gap1, y: this.params.to.y },
      this.params.targetDirection,
      this.params.to,
    );
    const pel2: Point = {
      x: pel1.x + flipDetourX,
      y: pel1.y + flipDetourY,
    };
    const pm: Point = { x: (pbl2.x + pel2.x) / 2, y: (pbl2.y + pel2.y) / 2 };
    const pbc1: Point = {
      x: pbl1.x + this.params.curvature * this.params.sourceDirection.x,
      y: pbl1.y + this.params.curvature * this.params.sourceDirection.y,
    };

    const pec1: Point = {
      x: pel1.x - this.params.curvature * this.params.targetDirection.x,
      y: pel1.y - this.params.curvature * this.params.targetDirection.y,
    };

    const pbc2: Point = {
      x: pbl1.x + flipDetourX,
      y: pbl1.y + flipDetourY,
    };
    const pec2: Point = {
      x: pel1.x + flipDetourX,
      y: pel1.y + flipDetourY,
    };

    return [
      `M ${pba.x} ${pba.y}`,
      `L ${pbl1.x} ${pbl1.y}`,
      `C ${pbc1.x} ${pbc1.y} ${pbc2.x} ${pbc2.y} ${pm.x} ${pm.y}`,
      `C ${pec2.x} ${pec2.y} ${pec1.x} ${pec1.y} ${pel1.x} ${pel1.y}`,
      `L ${pea.x} ${pea.y}`,
    ].join(" ");
  }
}
