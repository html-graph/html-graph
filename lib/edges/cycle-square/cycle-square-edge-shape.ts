import { GraphPort } from "@/graph-store";
import { EdgeShape } from "../edge-shape";
import { Point } from "@/point";
import {
  createArrowPath,
  createDirectionVector,
  createEdgeGroup,
  createEdgeSvg,
  createRotatedPoint,
  createRoundedPath,
} from "../utils";

export class CycleSquareEdgeShape implements EdgeShape {
  public readonly svg = createEdgeSvg();

  private readonly group = createEdgeGroup();

  private readonly line: SVGPathElement;

  private readonly arrow: SVGPathElement | null = null;

  private readonly roundness: number;

  private readonly linePoints: readonly Point[];

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

    this.svg.appendChild(this.group);

    this.line = document.createElementNS("http://www.w3.org/2000/svg", "path");
    this.line.setAttribute("stroke", this.color);
    this.line.setAttribute("stroke-width", `${this.width}`);
    this.line.setAttribute("fill", "none");
    this.group.appendChild(this.line);

    if (hasArrow) {
      this.arrow = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "path",
      );

      this.arrow.setAttribute("fill", this.color);
      this.group.appendChild(this.arrow);
    }

    this.svg.style.width = `0px`;
    this.svg.style.height = `0px`;

    const g = this.minPortOffset;
    const s = this.side;
    const x1 = this.arrowLength + g;
    const r = this.roundness;
    const x2 = x1 + 2 * s;

    console.log(r);

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
    x: number,
    y: number,
    _width: number,
    _height: number,
    from: GraphPort,
  ): void {
    this.svg.style.transform = `translate(${x}px, ${y}px)`;

    const fromVect = createDirectionVector(from.direction, 1, 1);

    const rp = this.linePoints.map((p) =>
      createRotatedPoint(p, fromVect, { x: 0, y: 0 }),
    );

    const preLine = `M ${0} ${0} L ${rp[0].x} ${rp[0].y} `;
    const linePath = `${this.arrow ? "" : preLine}${createRoundedPath(rp, this.roundness)}`;

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
