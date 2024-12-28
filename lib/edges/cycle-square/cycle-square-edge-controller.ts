import { PortPayload } from "@/port-payload";
import { EdgeController } from "../edge-controller";
import { Point } from "../point";
import {
  createArrowPath,
  createDirectionVector,
  createRotatedPoint,
} from "../utils";

export class CycleSquareEdgeController implements EdgeController {
  public readonly svg: SVGSVGElement;

  private readonly group: SVGGElement;

  private readonly line: SVGPathElement;

  private readonly arrow: SVGPathElement | null = null;

  private readonly roundness: number;

  private readonly points: readonly Point[];

  public constructor(
    private readonly color: string,
    private readonly width: number,
    private readonly arrowLength: number,
    private readonly arrowWidth: number,
    hasArrow: boolean,
    private readonly side: number,
    private readonly minPortOffset: number,
    roundness: number,
  ) {
    this.roundness = Math.min(roundness, this.minPortOffset, this.side / 2);
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

    const g = this.minPortOffset;
    const s = this.side;
    const x1 = this.arrowLength + g;
    const r = this.roundness;
    const x1l = x1 - r;
    const x1m = x1 + r;
    const y1l = s - r;
    const x2 = x1 + 2 * s;
    const x2l = x2 - r;

    console.log(r);

    this.points = [
      [this.arrowLength, 0],
      [x1l, 0],
      [x1, r],
      [x1, y1l],
      [x1m, s],
      [x2l, s],
      [x2, y1l],
      [x2, -y1l],
      [x2l, -s],
      [x1m, -s],
      [x1, -y1l],
      [x1, -r],
    ];
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

    const r = this.roundness;
    const rp = this.points.map((p) => createRotatedPoint(p, fromVect, [0, 0]));

    const c = [
      `M ${rp[0][0]} ${rp[0][1]}`,
      `L ${rp[1][0]} ${rp[1][1]}`,
      `A ${r} ${r} 0 0 1 ${rp[2][0]} ${rp[2][1]}`,
      `L ${rp[3][0]} ${rp[3][1]}`,
      `A ${r} ${r} 0 0 0 ${rp[4][0]} ${rp[4][1]}`,
      `L ${rp[5][0]} ${rp[5][1]}`,
      `A ${r} ${r} 0 0 0 ${rp[6][0]} ${rp[6][1]}`,
      `L ${rp[7][0]} ${rp[7][1]}`,
      `A ${r} ${r} 0 0 0 ${rp[8][0]} ${rp[8][1]}`,
      `L ${rp[9][0]} ${rp[9][1]}`,
      `A ${r} ${r} 0 0 0 ${rp[10][0]} ${rp[10][1]}`,
      `L ${rp[11][0]} ${rp[11][1]}`,
      `A ${r} ${r} 0 0 1 ${rp[1][0]} ${rp[1][1]}`,
    ].join(" ");

    const preLine = `M ${0} ${0} L ${rp[0][0]} ${rp[0][1]} `;
    const linePath = `${this.arrow ? "" : preLine}${c}`;

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
