import { Point, zero } from "@/point";
import { createRotatedPoint, createRoundedPath } from "../../geometry";
import { EdgePath } from "../edge-path";

export class VerticalEdgePath implements EdgePath {
  public readonly path: string;

  public readonly midpoint: Point;

  public constructor(
    private readonly params: {
      readonly to: Point;
      readonly sourceDirection: Point;
      readonly targetDirection: Point;
      readonly flipY: number;
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

    const halfHeight = Math.max((beginLine.y + endLine.y) / 2, gap);
    const halfWidth = this.params.to.x / 2;

    const begin1: Point = {
      x: beginLine.x,
      y: this.params.flipY > 0 ? halfHeight : -gap,
    };
    const begin2: Point = { x: halfWidth, y: begin1.y };

    const end1: Point = {
      x: endLine.x,
      y:
        this.params.flipY > 0
          ? this.params.to.y - halfHeight
          : this.params.to.y + gap,
    };
    const end2: Point = { x: halfWidth, y: end1.y };

    this.path = createRoundedPath(
      [beginArrow, beginLine, begin1, begin2, end2, end1, endLine, endArrow],
      this.params.roundness,
    );
  }
}
