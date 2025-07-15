import { Point, zero } from "@/point";
import { createRotatedPoint } from "../../create-rotated-point";
import { EdgePath } from "../edge-path";

export class BezierEdgePath implements EdgePath {
  public readonly path: string;

  public readonly midpoint: Point;

  public constructor(
    private readonly params: {
      readonly to: Point;
      readonly sourceDirection: Point;
      readonly targetDirection: Point;
      readonly arrowLength: number;
      readonly curvature: number;
      readonly hasSourceArrow: boolean;
      readonly hasTargetArrow: boolean;
    },
  ) {
    const to = this.params.to;

    this.midpoint = { x: to.x / 2, y: to.y / 2 };

    const begin = createRotatedPoint(
      { x: this.params.arrowLength, y: zero.y },
      this.params.sourceDirection,
      zero,
    );

    const end = createRotatedPoint(
      { x: this.params.to.x - this.params.arrowLength, y: this.params.to.y },
      this.params.targetDirection,
      this.params.to,
    );

    const bezierBegin: Point = {
      x: begin.x + this.params.sourceDirection.x * this.params.curvature,
      y: begin.y + this.params.sourceDirection.y * this.params.curvature,
    };

    const bezierEnd: Point = {
      x: end.x - this.params.targetDirection.x * this.params.curvature,
      y: end.y - this.params.targetDirection.y * this.params.curvature,
    };

    const curve = `M ${begin.x} ${begin.y} C ${bezierBegin.x} ${bezierBegin.y}, ${bezierEnd.x} ${bezierEnd.y}, ${end.x} ${end.y}`;
    const preLine = this.params.hasSourceArrow
      ? ""
      : `M ${zero.x} ${zero.y} L ${begin.x} ${begin.y} `;
    const postLine = this.params.hasTargetArrow
      ? ""
      : ` M ${end.x} ${end.y} L ${this.params.to.x} ${this.params.to.y}`;

    this.path = `${preLine}${curve}${postLine}`;
  }
}
