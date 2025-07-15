import { Point, zero } from "@/point";
import { createRotatedPoint } from "../../create-rotated-point";
import { createRoundedPath } from "../../create-rounded-path";
import { EdgePath } from "../edge-path";

export class HorizontalEdgePath implements EdgePath {
  public readonly path: string;

  public readonly midpoint: Point;

  public constructor(
    private readonly params: {
      readonly to: Point;
      readonly sourceDirection: Point;
      readonly targetDirection: Point;
      readonly flipX: number;
      readonly arrowLength: number;
      readonly arrowOffset: number;
      readonly roundness: number;
      readonly hasSourceArrow: boolean;
      readonly hasTargetArrow: boolean;
    },
  ) {
    const to = this.params.to;

    this.midpoint = { x: to.x / 2, y: to.y / 2 };

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

    const gap = this.params.arrowLength + this.params.arrowOffset;
    const gapRoundness = gap - this.params.roundness;

    const beginLine = createRotatedPoint(
      { x: gapRoundness, y: zero.y },
      this.params.sourceDirection,
      zero,
    );

    const endLine = createRotatedPoint(
      { x: this.params.to.x - gapRoundness, y: this.params.to.y },
      this.params.targetDirection,
      this.params.to,
    );

    const halfWidth = Math.max((beginLine.x + endLine.x) / 2, gap);
    const halfHeight = this.params.to.y / 2;

    const begin1: Point = {
      x: this.params.flipX > 0 ? halfWidth : -gap,
      y: beginLine.y,
    };
    const begin2: Point = { x: begin1.x, y: halfHeight };

    const end1: Point = {
      x:
        this.params.flipX > 0
          ? this.params.to.x - halfWidth
          : this.params.to.x + gap,
      y: endLine.y,
    };
    const end2: Point = { x: end1.x, y: halfHeight };

    this.path = createRoundedPath(
      [beginArrow, beginLine, begin1, begin2, end2, end1, endLine, endArrow],
      this.params.roundness,
    );
  }
}
