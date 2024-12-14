import { PortPayload } from "@/port-payload";
import { ConnectionController } from "../connection-controller";
import { ConnectionUtils } from "../connection-utils";
import { Point } from "../point";

export class CycleBezierConnectionController implements ConnectionController {
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
    private readonly radius: number,
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

    const points: Point[] = [
      [this.arrowLength, 0],
      [this.arrowLength + this.radius, 0],
      [this.arrowLength + this.radius, -this.radius],
      [this.arrowLength + this.radius, -2 * this.radius],
      [this.arrowLength + 2 * this.radius, -2 * this.radius],
      [this.arrowLength + 4 * this.radius, -2 * this.radius],
      [this.arrowLength + 4 * this.radius, 0],
      [this.arrowLength + 4 * this.radius, 2 * this.radius],
      [this.arrowLength + 2 * this.radius, 2 * this.radius],
      [this.arrowLength + this.radius, 2 * this.radius],
      [this.arrowLength + this.radius, this.radius],
    ];

    const rp = points.map((p) => ConnectionUtils.rotate(p, fromVect, [0, 0]));

    const nl = [
      `M ${rp[0][0]} ${rp[0][1]}`,
      `C ${rp[1][0]} ${rp[1][1]}, ${rp[1][0]} ${rp[1][1]}, ${rp[2][0]} ${rp[2][1]}`,
      `C ${rp[3][0]} ${rp[3][1]}, ${rp[3][0]} ${rp[3][1]}, ${rp[4][0]} ${rp[4][1]}`,
      `C ${rp[5][0]} ${rp[5][1]}, ${rp[5][0]} ${rp[5][1]}, ${rp[6][0]} ${rp[6][1]}`,
      `C ${rp[7][0]} ${rp[7][1]}, ${rp[7][0]} ${rp[7][1]}, ${rp[8][0]} ${rp[8][1]}`,
      `C ${rp[9][0]} ${rp[9][1]}, ${rp[9][0]} ${rp[9][1]}, ${rp[10][0]} ${rp[10][1]}`,
      `C ${rp[1][0]} ${rp[1][1]}, ${rp[1][0]} ${rp[1][1]}, ${rp[0][0]} ${rp[0][1]}`,
    ].join(" ");

    const preLine = `M ${0} ${0} L ${rp[0][0]} ${rp[0][1]} `;
    const linePath = `${this.hasArrow ? "" : preLine}${nl}`;

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
