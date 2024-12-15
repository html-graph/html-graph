import { PortPayload } from "@/port-payload";
import { ConnectionController } from "../connection-controller";
import { ConnectionUtils } from "../connection-utils";
import { Point } from "../point";

export class CycleSquareConnectionController implements ConnectionController {
  public readonly svg: SVGSVGElement;

  private readonly group: SVGGElement;

  private readonly line: SVGPathElement;

  private readonly arrow: SVGPathElement | null = null;

  public constructor(
    private readonly color: string,
    private readonly width: number,
    private readonly arrowLength: number,
    private readonly arrowWidth: number,
    private readonly hasArrow: boolean,
    private readonly side: number,
    private readonly gap: number,
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

    if (this.hasArrow) {
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

    const fromVect = ConnectionUtils.getDirectionVector(from.direction, 1, 1);

    const g = this.gap;
    const s = this.side;
    const x1 = this.arrowLength + g;
    const x2 = x1 + 2 * s;

    const points: Point[] = [
      [this.arrowLength, 0],
      [x1, 0],
      [x1, s],
      [x2, s],
      [x2, -s],
      [x1, -s],
    ];

    const rp = points.map((p) => ConnectionUtils.rotate(p, fromVect, [0, 0]));

    const c = [
      `M ${rp[0][0]} ${rp[0][1]}`,
      `L ${rp[1][0]} ${rp[1][1]}`,
      `L ${rp[2][0]} ${rp[2][1]}`,
      `L ${rp[3][0]} ${rp[3][1]}`,
      `L ${rp[4][0]} ${rp[4][1]}`,
      `L ${rp[5][0]} ${rp[5][1]}`,
      `L ${rp[1][0]} ${rp[1][1]}`,
    ].join(" ");

    const preLine = `M ${0} ${0} L ${rp[0][0]} ${rp[0][1]} `;
    const linePath = `${this.hasArrow ? "" : preLine}${c}`;

    this.line.setAttribute("d", linePath);

    if (this.arrow) {
      const arrowPath = ConnectionUtils.getArrowPath(
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
