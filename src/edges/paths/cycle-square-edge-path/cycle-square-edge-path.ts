import { Point } from "@/point";
import { createRotatedPoint } from "../../geometry";
import { EdgePath } from "../edge-path";
import { createRoundedPath } from "../../svg";
import { zeroPoint } from "../../zero-point";

export class CycleSquareEdgePath implements EdgePath {
  public readonly path: string;

  public readonly midpoint: Point;

  public constructor(
    private readonly params: {
      readonly sourceDirection: Point;
      readonly arrowLength: number;
      readonly side: number;
      readonly arrowOffset: number;
      readonly roundness: number;
      readonly hasSourceArrow: boolean;
      readonly hasTargetArrow: boolean;
    },
  ) {
    const g = this.params.arrowOffset;
    const s = this.params.side;
    const x1 = this.params.arrowLength + g;
    const x2 = x1 + 2 * s;

    const linePoints = [
      { x: this.params.arrowLength, y: zeroPoint.y },
      { x: x1, y: zeroPoint.y },
      { x: x1, y: this.params.side },
      { x: x2, y: this.params.side },
      { x: x2, y: -this.params.side },
      { x: x1, y: -this.params.side },
      { x: x1, y: zeroPoint.y },
      { x: this.params.arrowLength, y: zeroPoint.y },
    ];

    const rp = linePoints.map((p) =>
      createRotatedPoint(p, this.params.sourceDirection, zeroPoint),
    );

    const preLine = `M ${zeroPoint.x} ${zeroPoint.y} L ${rp[0].x} ${rp[0].y} `;

    this.path = `${this.params.hasSourceArrow || this.params.hasTargetArrow ? "" : preLine}${createRoundedPath(rp, this.params.roundness)}`;

    this.midpoint = { x: (rp[3].x + rp[4].x) / 2, y: (rp[3].y + rp[4].y) / 2 };
  }
}
