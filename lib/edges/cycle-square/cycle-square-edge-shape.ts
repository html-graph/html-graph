import { EdgeShape } from "../edge-shape";
import { Point } from "@/point";
import {
  createArrowPath,
  createFlipDirectionVector,
  createEdgeArrow,
  createEdgeGroup,
  createEdgeSvg,
  createRotatedPoint,
  createRoundedPath,
  createEdgeLine,
} from "../utils";
import { zero } from "../zero";

export class CycleSquareEdgeShape implements EdgeShape {
  public readonly svg = createEdgeSvg();

  private readonly group = createEdgeGroup();

  private readonly line: SVGPathElement;

  private readonly arrow: SVGPathElement | null = null;

  private readonly roundness: number;

  private readonly linePoints: readonly Point[];

  public constructor(
    color: string,
    width: number,
    private readonly arrowLength: number,
    private readonly arrowWidth: number,
    hasArrow: boolean,
    private readonly side: number,
    private readonly minPortOffset: number,
    roundness: number,
  ) {
    this.roundness = Math.min(roundness, this.minPortOffset, this.side / 2);

    this.svg.appendChild(this.group);
    this.line = createEdgeLine(color, width);
    this.group.appendChild(this.line);

    if (hasArrow) {
      this.arrow = createEdgeArrow(color);
      this.group.appendChild(this.arrow);
    }

    const g = this.minPortOffset;
    const s = this.side;
    const x1 = this.arrowLength + g;
    const x2 = x1 + 2 * s;

    this.linePoints = [
      { x: this.arrowLength, y: zero.y },
      { x: x1, y: zero.y },
      { x: x1, y: this.side },
      { x: x2, y: this.side },
      { x: x2, y: -this.side },
      { x: x1, y: -this.side },
      { x: x1, y: zero.y },
      { x: this.arrowLength, y: zero.y },
    ];
  }

  public update(
    _to: Point,
    flipX: number,
    flipY: number,
    fromDir: number,
  ): void {
    const fromVect = createFlipDirectionVector(fromDir, flipX, flipY);

    const linePath = this.createLinePath(fromVect);

    this.line.setAttribute("d", linePath);

    if (this.arrow) {
      const arrowPath = createArrowPath(
        fromVect,
        zero,
        this.arrowLength,
        this.arrowWidth,
      );

      this.arrow.setAttribute("d", arrowPath);
    }
  }

  private createLinePath(fromVect: Point): string {
    const rp = this.linePoints.map((p) =>
      createRotatedPoint(p, fromVect, zero),
    );

    const preLine = `M ${zero.x} ${zero.y} L ${rp[0].x} ${rp[0].y} `;

    return `${this.arrow ? "" : preLine}${createRoundedPath(rp, this.roundness)}`;
  }
}
