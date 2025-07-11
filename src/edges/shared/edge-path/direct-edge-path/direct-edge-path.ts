import { Point, zero } from "@/point";
import { EdgePath } from "../edge-path";

export class DirectEdgePath implements EdgePath {
  public readonly path: string;

  public readonly median: Point;

  public readonly diagonalDistance: number;

  public constructor(
    private readonly params: {
      readonly to: Point;
      readonly sourceOffset: number;
      readonly targetOffset: number;
      readonly hasSourceArrow: boolean;
      readonly hasTargetArrow: boolean;
      readonly arrowLength: number;
    },
  ) {
    const to = this.params.to;

    this.median = { x: to.x / 2, y: to.y / 2 };

    this.diagonalDistance = Math.sqrt(
      this.params.to.x * this.params.to.x + this.params.to.y * this.params.to.y,
    );

    const diagonalDistance = Math.sqrt(
      this.params.to.x * this.params.to.x + this.params.to.y * this.params.to.y,
    );

    if (diagonalDistance === 0) {
      this.path = "";
      return;
    }

    const source = this.createDirectLinePoint({
      offset: this.params.sourceOffset,
      hasArrow: this.params.hasSourceArrow,
      flip: 1,
      shift: zero,
    });

    const target = this.createDirectLinePoint({
      offset: this.params.targetOffset,
      hasArrow: this.params.hasTargetArrow,
      flip: -1,
      shift: this.params.to,
    });

    this.path = `M ${source.x} ${source.y} L ${target.x} ${target.y}`;
  }

  private createDirectLinePoint(params: {
    readonly offset: number;
    readonly hasArrow: boolean;
    readonly flip: number;
    readonly shift: Point;
  }): Point {
    const arrowOffset = params.hasArrow ? this.params.arrowLength : 0;
    const totalOffset = params.offset + arrowOffset;
    const targetRatio = (params.flip * totalOffset) / this.diagonalDistance;

    return {
      x: this.params.to.x * targetRatio + params.shift.x,
      y: this.params.to.y * targetRatio + params.shift.y,
    };
  }
}
