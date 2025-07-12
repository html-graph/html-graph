import { Point, zero } from "@/point";
import { createRotatedPoint } from "../../create-rotated-point";
import { createRoundedPath } from "../../create-rounded-path";
import { EdgePath } from "../edge-path";
import { flipPoint } from "../../flip-point";

export class DetourStraightEdgePath implements EdgePath {
  public readonly path: string;

  public readonly median: Point;

  public constructor(
    private readonly params: {
      readonly to: Point;
      readonly sourceDirection: Point;
      readonly targetDirection: Point;
      readonly flipX: number;
      readonly flipY: number;
      readonly arrowLength: number;
      readonly arrowOffset: number;
      readonly roundness: number;
      readonly detourDirection: number;
      readonly detourDistance: number;
      readonly hasSourceArrow: boolean;
      readonly hasTargetArrow: boolean;
    },
  ) {
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

    const gap1 = this.params.arrowLength + this.params.arrowOffset;

    const pbl1: Point = createRotatedPoint(
      { x: gap1, y: zero.y },
      this.params.sourceDirection,
      zero,
    );

    const detourX =
      Math.cos(this.params.detourDirection) * this.params.detourDistance;
    const detourY =
      Math.sin(this.params.detourDirection) * this.params.detourDistance;

    const flipDetourX = detourX * this.params.flipX;
    const flipDetourY = detourY * this.params.flipY;

    const pbl2: Point = { x: pbl1.x + flipDetourX, y: pbl1.y + flipDetourY };
    const pel1: Point = createRotatedPoint(
      { x: this.params.to.x - gap1, y: this.params.to.y },
      this.params.targetDirection,
      this.params.to,
    );
    const pel2: Point = { x: pel1.x + flipDetourX, y: pel1.y + flipDetourY };

    const center = { x: (pbl2.x + pel2.x) / 2, y: (pbl2.y + pel2.y) / 2 };

    this.median = flipPoint(center, params.flipX, params.flipY, params.to);

    this.path = createRoundedPath(
      [pba, pbl1, pbl2, pel2, pel1, pea],
      this.params.roundness,
    );
  }
}
