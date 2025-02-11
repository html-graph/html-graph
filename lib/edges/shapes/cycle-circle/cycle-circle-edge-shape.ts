import { EdgeShape } from "../edge-shape";
import { EdgeRenderParams } from "../edge-render-params";
import {
  createArrowPath,
  createFlipDirectionVector,
  createEdgeArrow,
  createEdgeSvg,
  createRotatedPoint,
  createEdgeLine,
} from "../utils";
import { Point, zero } from "@/point";

export class CycleCircleEdgeShape implements EdgeShape {
  public readonly svg = createEdgeSvg();

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
    this.line = createEdgeLine(color, width);
    this.svg.appendChild(this.line);

    if (hasArrow) {
      this.arrow = createEdgeArrow(color);
      this.svg.appendChild(this.arrow);
    }
  }

  public render(params: EdgeRenderParams): void {
    const fromVect = createFlipDirectionVector(
      params.source.direction,
      params.flipX,
      params.flipY,
    );

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
    const r = this.smallRadius;
    const R = this.radius;
    const len = Math.sqrt(r * r + R * R);
    const g = r + R;
    const px = this.arrowLength + len * (1 - R / g);
    const py = (r * R) / g;

    const points: Point[] = [
      { x: this.arrowLength, y: zero.y },
      { x: px, y: py },
      { x: px, y: -py },
    ];

    const rp = points.map((p) => createRotatedPoint(p, fromVect, zero));

    const c = [
      `M ${rp[0].x} ${rp[0].y}`,
      `A ${r} ${r} 0 0 1 ${rp[1].x} ${rp[1].y}`,
      `A ${R} ${R} 0 1 0 ${rp[2].x} ${rp[2].y}`,
      `A ${r} ${r} 0 0 1 ${rp[0].x} ${rp[0].y}`,
    ].join(" ");

    const preLine = `M ${0} ${0} L ${rp[0].x} ${rp[0].y} `;

    return `${this.arrow !== null ? "" : preLine}${c}`;
  }
}
