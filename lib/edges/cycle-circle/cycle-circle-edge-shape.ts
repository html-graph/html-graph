import { PortPayload } from "@/port-payload";
import { EdgeShape } from "../edge-shape";
import { Point } from "@/point";
import {
  createArrowPath,
  createDirectionVector,
  createRotatedPoint,
} from "../utils";

export class CycleCircleEdgeShape implements EdgeShape {
  public readonly svg: SVGSVGElement;

  private readonly group: SVGGElement;

  private readonly line: SVGPathElement;

  private readonly arrow: SVGPathElement | null = null;

  public constructor(
    private readonly color: string,
    private readonly width: number,
    private readonly arrowLength: number,
    private readonly arrowWidth: number,
    hasArrow: boolean,
    private readonly radius: number,
    private readonly smallRadius: number,
  ) {
    this.svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    this.svg.style.pointerEvents = "none";
    this.svg.style.position = "absolute";
    this.svg.style.top = "0";
    this.svg.style.left = "0";

    this.group = document.createElementNS("http://www.w3.org/2000/svg", "g");
    this.svg.appendChild(this.group);

    this.line = document.createElementNS("http://www.w3.org/2000/svg", "path");
    this.line.setAttribute("stroke", this.color);
    this.line.setAttribute("stroke-width", `${this.width}`);
    this.line.setAttribute("fill", "none");
    this.group.appendChild(this.line);
    this.group.style.transformOrigin = `50% 50%`;

    if (hasArrow) {
      this.arrow = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "path",
      );

      this.arrow.setAttribute("fill", this.color);
      this.group.appendChild(this.arrow);
    }

    this.svg.style.overflow = "visible";
    this.svg.style.width = `0px`;
    this.svg.style.height = `0px`;
  }

  public update(
    x: number,
    y: number,
    _width: number,
    _height: number,
    from: PortPayload,
  ): void {
    this.svg.style.transform = `translate(${x}px, ${y}px)`;

    const fromVect = createDirectionVector(from.direction, 1, 1);

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
