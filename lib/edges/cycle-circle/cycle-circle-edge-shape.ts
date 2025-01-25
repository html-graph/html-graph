import { EdgeShape } from "../edge-shape";
import { Point } from "@/point";
import {
  createArrowPath,
  createFlipDirectionVector,
  createEdgeArrow,
  createEdgeGroup,
  createEdgeSvg,
  createRotatedPoint,
  createEdgeLine,
  createDirectionVector,
} from "../utils";

export class CycleCircleEdgeShape implements EdgeShape {
  public readonly svg = createEdgeSvg();

  private readonly group = createEdgeGroup();

  private readonly line: SVGPathElement;

  private readonly arrow: SVGPathElement | null = null;

  public constructor(
    color: string,
    width: number,
    private readonly arrowLength: number,
    private readonly arrowWidth: number,
    hasArrow: boolean,
    private readonly radius: number,
    private readonly smallRadius: number,
  ) {
    this.svg.appendChild(this.group);
    this.line = createEdgeLine(color, width);
    this.group.appendChild(this.line);

    if (hasArrow) {
      this.arrow = createEdgeArrow(color);
      this.group.appendChild(this.arrow);
    }

    this.svg.style.width = `0px`;
    this.svg.style.height = `0px`;
  }

  public update(
    _width: number,
    _height: number,
    _flipX: number,
    _flipY: number,
    fromDir: number,
  ): void {
    const fromVect = createFlipDirectionVector(
      createDirectionVector(fromDir),
      1,
      1,
    );

    const r = this.smallRadius;
    const R = this.radius;
    const len = Math.sqrt(r * r + R * R);
    const g = r + R;
    const px = this.arrowLength + len * (1 - R / g);
    const py = (r * R) / g;

    const points: Point[] = [
      { x: this.arrowLength, y: 0 },
      { x: px, y: py },
      { x: px, y: -py },
    ];

    const rp = points.map((p) =>
      createRotatedPoint(p, fromVect, { x: 0, y: 0 }),
    );

    const c = [
      `M ${rp[0].x} ${rp[0].y}`,
      `A ${r} ${r} 0 0 1 ${rp[1].x} ${rp[1].y}`,
      `A ${R} ${R} 0 1 0 ${rp[2].x} ${rp[2].y}`,
      `A ${r} ${r} 0 0 1 ${rp[0].x} ${rp[0].y}`,
    ].join(" ");

    const preLine = `M ${0} ${0} L ${rp[0].x} ${rp[0].y} `;
    const linePath = `${this.arrow !== null ? "" : preLine}${c}`;

    this.line.setAttribute("d", linePath);

    if (this.arrow) {
      const arrowPath = createArrowPath(
        fromVect,
        0,
        0,
        this.arrowLength,
        this.arrowWidth,
      );

      this.arrow.setAttribute("d", arrowPath);
    }
  }
}
