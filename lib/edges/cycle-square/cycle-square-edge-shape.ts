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
import { from } from "../from";

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
      { x: this.arrowLength, y: 0 },
      { x: x1, y: 0 },
      { x: x1, y: this.side },
      { x: x2, y: this.side },
      { x: x2, y: -this.side },
      { x: x1, y: -this.side },
      { x: x1, y: 0 },
      { x: this.arrowLength, y: 0 },
    ];
  }

  public update(
    _to: Point,
    _flipX: number,
    _flipY: number,
    fromDir: number,
  ): void {
    const fromVect = createFlipDirectionVector(fromDir, 1, 1);

    const rp = this.linePoints.map((p) =>
      createRotatedPoint(p, fromVect, from),
    );

    const preLine = `M ${0} ${0} L ${rp[0].x} ${rp[0].y} `;
    const linePath = `${this.arrow ? "" : preLine}${createRoundedPath(rp, this.roundness)}`;

    this.line.setAttribute("d", linePath);

    if (this.arrow) {
      const arrowPath = createArrowPath(
        fromVect,
        from,
        this.arrowLength,
        this.arrowWidth,
      );

      this.arrow.setAttribute("d", arrowPath);
    }
  }
}
