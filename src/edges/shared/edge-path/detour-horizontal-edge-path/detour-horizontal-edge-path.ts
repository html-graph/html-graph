import { Point, zero } from "@/point";
import { createRotatedPoint } from "../../create-rotated-point";
import { createRoundedPath } from "../../create-rounded-path";
import { EdgePath } from "../edge-path";
import { flipPoint } from "../../flip-point";

export class DetourHorizontalEdgePath implements EdgePath {
  public readonly path: string;

  public readonly midpoint: Point;

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
      readonly detourDistance: number;
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

    const gap = this.params.arrowLength + this.params.arrowOffset;

    const beginLine1: Point = createRotatedPoint(
      { x: gap, y: zero.y },
      this.params.sourceDirection,
      zero,
    );

    const endLine1: Point = createRotatedPoint(
      { x: this.params.to.x - gap, y: this.params.to.y },
      this.params.targetDirection,
      this.params.to,
    );

    const flipDetour = this.params.detourDistance > 0 ? 1 : -1;
    const halfHeight = this.params.to.y / 2;
    const centerDetour = halfHeight + Math.abs(this.params.detourDistance);
    const lowest = halfHeight + centerDetour * this.params.flipY * flipDetour;

    const center = {
      x: (beginLine1.x + endLine1.x) / 2,
      y: lowest,
    };

    this.midpoint = flipPoint(center, params.flipX, params.flipY, params.to);

    this.path = createRoundedPath(
      [
        beginArrow,
        beginLine1,
        { x: beginLine1.x, y: lowest },
        { x: endLine1.x, y: lowest },
        endLine1,
        endArrow,
      ],
      this.params.roundness,
    );
  }
}
