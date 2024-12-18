import { PortPayload } from "@/port-payload";
import { EdgeController } from "../edge-controller";
import { EdgeUtils } from "../edge-utils";
import { Point } from "../point";

export class CycleCircleEdgeController implements EdgeController {
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

    const fromVect = EdgeUtils.getDirectionVector(from.direction, 1, 1);

    const r = this.smallRadius;
    const R = this.radius;
    const len = Math.sqrt(r * r + R * R);
    const g = r + R;
    const px = this.arrowLength + len * (1 - R / g);
    const py = (r * R) / g;

    const points: Point[] = [
      [this.arrowLength, 0],
      [px, py],
      [px, -py],
    ];

    const rp = points.map((p) => EdgeUtils.rotate(p, fromVect, [0, 0]));

    const c = [
      `M ${rp[0][0]} ${rp[0][1]}`,
      `A ${r} ${r} 0 0 1 ${rp[1][0]} ${rp[1][1]}`,
      `A ${R} ${R} 0 1 0 ${rp[2][0]} ${rp[2][1]}`,
      `A ${r} ${r} 0 0 1 ${rp[0][0]} ${rp[0][1]}`,
    ].join(" ");

    const preLine = `M ${0} ${0} L ${rp[0][0]} ${rp[0][1]} `;
    const linePath = `${this.arrow !== null ? "" : preLine}${c}`;

    this.line.setAttribute("d", linePath);

    if (this.arrow) {
      const arrowPath = EdgeUtils.getArrowPath(
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
