import { GraphPort } from "@/graph-store";
import { EdgeShape } from "../edge-shape";
import {
  createArrowPath,
  createDirectionVector,
  createEdgeGroup,
  createEdgeSvg,
  createPortCenter,
  createRotatedPoint,
} from "../utils";
import { Point } from "@/point";

export class DetourBezierEdgeShape implements EdgeShape {
  public readonly svg = createEdgeSvg();

  private readonly group = createEdgeGroup();

  private readonly line: SVGPathElement;

  private readonly sourceArrow: SVGPathElement | null = null;

  private readonly targetArrow: SVGPathElement | null = null;

  private readonly detourX: number;

  private readonly detourY: number;

  public constructor(
    private readonly color: string,
    private readonly width: number,
    private readonly curvature: number,
    private readonly arrowLength: number,
    private readonly arrowWidth: number,
    hasSourceArrow: boolean,
    hasTargetArrow: boolean,
    detourDistance: number,
    detourDirection: number,
  ) {
    this.detourX = Math.cos(detourDirection) * detourDistance;
    this.detourY = Math.sin(detourDirection) * detourDistance;

    this.svg.appendChild(this.group);

    this.line = document.createElementNS("http://www.w3.org/2000/svg", "path");
    this.line.setAttribute("stroke", this.color);
    this.line.setAttribute("stroke-width", `${this.width}`);
    this.line.setAttribute("fill", "none");
    this.group.appendChild(this.line);

    if (hasSourceArrow) {
      this.sourceArrow = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "path",
      );

      this.sourceArrow.setAttribute("fill", this.color);
      this.group.appendChild(this.sourceArrow);
    }

    if (hasTargetArrow) {
      this.targetArrow = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "path",
      );

      this.targetArrow.setAttribute("fill", this.color);
      this.group.appendChild(this.targetArrow);
    }
  }

  public update(
    x: number,
    y: number,
    width: number,
    height: number,
    from: GraphPort,
    to: GraphPort,
  ): void {
    this.svg.style.width = `${width}px`;
    this.svg.style.height = `${height}px`;
    this.svg.style.transform = `translate(${x}px, ${y}px)`;

    const fromCenter = createPortCenter(from);
    const toCenter = createPortCenter(to);
    const flipX = fromCenter.x <= toCenter.x ? 1 : -1;
    const flipY = fromCenter.y <= toCenter.y ? 1 : -1;

    this.group.style.transform = `scale(${flipX}, ${flipY})`;

    const fromVect = createDirectionVector(from.direction, flipX, flipY);
    const toVect = createDirectionVector(to.direction, flipX, flipY);

    const pba: Point = this.sourceArrow
      ? createRotatedPoint({ x: this.arrowLength, y: 0 }, fromVect, {
          x: 0,
          y: 0,
        })
      : { x: 0, y: 0 };
    const pea: Point = this.targetArrow
      ? createRotatedPoint({ x: width - this.arrowLength, y: height }, toVect, {
          x: width,
          y: height,
        })
      : { x: width, y: height };

    const gap1 = this.arrowLength;

    const pbl1: Point = createRotatedPoint({ x: gap1, y: 0 }, fromVect, {
      x: 0,
      y: 0,
    });
    const pbl2: Point = { x: pbl1.x + this.detourX, y: pbl1.y + this.detourY };
    const pel1: Point = createRotatedPoint(
      { x: width - gap1, y: height },
      toVect,
      {
        x: width,
        y: height,
      },
    );
    const pel2: Point = { x: pel1.x + this.detourX, y: pel1.y + this.detourY };
    const pm: Point = { x: (pbl2.x + pel2.x) / 2, y: (pbl2.y + pel2.y) / 2 };
    const pbc1: Point = {
      x: pbl1.x - this.curvature * Math.cos(from.direction),
      y: pbl1.y - this.curvature * Math.sin(from.direction),
    };

    const pec1: Point = {
      x: pel1.x + this.curvature * Math.cos(to.direction),
      y: pel1.y + this.curvature * Math.sin(to.direction),
    };

    const pbc2: Point = { x: pbl1.x + this.detourX, y: pbl1.y + this.detourY };
    const pec2: Point = { x: pel1.x + this.detourX, y: pel1.y + this.detourY };

    const linePath = [
      `M ${pba.x} ${pba.y}`,
      `L ${pbl1.x} ${pbl1.y}`,
      `C ${pbc1.x} ${pbc1.y} ${pbc2.x} ${pbc2.y} ${pm.x} ${pm.y}`,
      `C ${pec2.x} ${pec2.y} ${pec1.x} ${pec1.y} ${pel1.x} ${pel1.y}`,
      `L ${pea.x} ${pea.y}`,
    ].join(" ");

    this.line.setAttribute("d", linePath);

    if (this.sourceArrow) {
      const arrowPath = createArrowPath(
        fromVect,
        0,
        0,
        this.arrowLength,
        this.arrowWidth,
      );

      this.sourceArrow.setAttribute("d", arrowPath);
    }

    if (this.targetArrow) {
      const arrowPath = createArrowPath(
        toVect,
        width,
        height,
        -this.arrowLength,
        this.arrowWidth,
      );

      this.targetArrow.setAttribute("d", arrowPath);
    }
  }
}
