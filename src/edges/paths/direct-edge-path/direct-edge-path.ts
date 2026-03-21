import { Point } from "@/point";
import { EdgePath } from "../edge-path";

export class DirectEdgePath implements EdgePath {
  public readonly path: string;

  public readonly midpoint: Point;

  public readonly diagonalDistance: number;

  public constructor(params: {
    readonly from: Point;
    readonly to: Point;
    readonly sourceOffset: number;
    readonly targetOffset: number;
    readonly hasSourceArrow: boolean;
    readonly hasTargetArrow: boolean;
    readonly arrowLength: number;
  }) {
    const {
      from,
      to,
      sourceOffset,
      targetOffset,
      hasSourceArrow,
      hasTargetArrow,
      arrowLength,
    } = params;

    this.midpoint = { x: (from.x + to.x) / 2, y: (from.y + to.y) / 2 };

    const width = to.x - from.x;
    const height = to.y - from.y;

    this.diagonalDistance = Math.sqrt(width * width + height * height);

    if (this.diagonalDistance === 0) {
      this.path = "";
      return;
    }

    const dir: Point = { x: width, y: height };

    const source = this.createDirectLinePoint({
      offset: sourceOffset,
      hasArrow: hasSourceArrow,
      flip: 1,
      shift: from,
      arrowLength,
      dir,
    });

    const target = this.createDirectLinePoint({
      offset: targetOffset,
      hasArrow: hasTargetArrow,
      flip: -1,
      shift: to,
      arrowLength,
      dir,
    });

    this.path = `M ${source.x} ${source.y} L ${target.x} ${target.y}`;
  }

  private createDirectLinePoint(params: {
    readonly offset: number;
    readonly hasArrow: boolean;
    readonly flip: number;
    readonly shift: Point;
    readonly arrowLength: number;
    readonly dir: Point;
  }): Point {
    const arrowOffset = params.hasArrow ? params.arrowLength : 0;
    const totalOffset = params.offset + arrowOffset;
    const targetRatio = (params.flip * totalOffset) / this.diagonalDistance;
    const { dir, shift } = params;

    return {
      x: dir.x * targetRatio + shift.x,
      y: dir.y * targetRatio + shift.y,
    };
  }
}
