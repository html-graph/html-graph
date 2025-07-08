import { Point, zero } from "@/point";
import { createRotatedPoint } from "../../create-rotated-point";
import { createRoundedPath } from "../../create-rounded-path";
import { EdgePath } from "../edge-path";

export class StraightEdgePath implements EdgePath {
  public constructor(
    private readonly params: {
      readonly to: Point;
      readonly sourceDirection: Point;
      readonly targetDirection: Point;
      readonly arrowLength: number;
      readonly arrowOffset: number;
      readonly roundness: number;
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

    const gap = this.params.arrowLength + this.params.arrowOffset;

    const pbl = createRotatedPoint(
      { x: gap, y: zero.y },
      this.params.sourceDirection,
      zero,
    );
    const pel = createRotatedPoint(
      { x: this.params.to.x - gap, y: this.params.to.y },
      this.params.targetDirection,
      this.params.to,
    );

    return createRoundedPath([pba, pbl, pel, pea], this.params.roundness);
  }
}
