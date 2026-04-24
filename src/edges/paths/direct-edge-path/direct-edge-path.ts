import { Point } from "@/point";
import { EdgePath } from "../edge-path";

export class DirectEdgePath implements EdgePath {
  public readonly path: string;

  public readonly midpoint: Point;

  public constructor(params: {
    readonly from: Point;
    readonly to: Point;
    readonly sourceOffset: number;
    readonly targetOffset: number;
    readonly hasSourceArrow: boolean;
    readonly hasTargetArrow: boolean;
    readonly arrowLength: number;
    readonly diagonal: number;
    readonly direction: Point;
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

    // TODO: account for offsets when calculating midpoint
    this.midpoint = { x: (from.x + to.x) / 2, y: (from.y + to.y) / 2 };

    if (params.diagonal === 0) {
      this.path = "";
      return;
    }

    const source = this.createDirectLinePoint({
      offset: sourceOffset,
      hasArrow: hasSourceArrow,
      flip: 1,
      shift: from,
      arrowLength,
      dir: params.direction,
      diagonal: params.diagonal,
    });

    const target = this.createDirectLinePoint({
      offset: targetOffset,
      hasArrow: hasTargetArrow,
      flip: -1,
      shift: to,
      arrowLength,
      dir: params.direction,
      diagonal: params.diagonal,
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
    readonly diagonal: number;
  }): Point {
    const arrowOffset = params.hasArrow ? params.arrowLength : 0;
    const totalOffset = params.offset + arrowOffset;
    const targetOffset = params.flip * totalOffset;
    const { dir, shift } = params;

    return {
      x: dir.x * targetOffset + shift.x,
      y: dir.y * targetOffset + shift.y,
    };
  }
}
