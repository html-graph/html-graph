import { Point, zero } from "@/point";
import { ConnectionLine } from "../connection-line";

export class DirectLine implements ConnectionLine {
  public constructor(
    private readonly params: {
      readonly diagonalDistance: number;
      readonly to: Point;
      readonly sourceOffset: number;
      readonly targetOffset: number;
      readonly hasSourceArrow: boolean;
      readonly hasTargetArrow: boolean;
      readonly arrowLength: number;
    },
  ) {}

  public getPath(): string {
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

    return `M ${source.x} ${source.y} L ${target.x} ${target.y}`;
  }

  private createDirectLinePoint(params: {
    readonly offset: number;
    readonly hasArrow: boolean;
    readonly flip: number;
    readonly shift: Point;
  }): Point {
    const arrowOffset = params.hasArrow ? this.params.arrowLength : 0;
    const totalOffset = params.offset + arrowOffset;
    const targetRatio =
      (params.flip * totalOffset) / this.params.diagonalDistance;

    return {
      x: this.params.to.x * targetRatio + params.shift.x,
      y: this.params.to.y * targetRatio + params.shift.y,
    };
  }
}
