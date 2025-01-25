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
import { createRoundedPath } from "../utils";
import { Point } from "@/point";

export class VerticalEdgeShape implements EdgeShape {
  public readonly svg = createEdgeSvg();

  private readonly group = createEdgeGroup();

  private readonly line: SVGPathElement;

  private readonly sourceArrow: SVGPathElement | null = null;

  private readonly targetArrow: SVGPathElement | null = null;

  public constructor(
    private readonly color: string,
    private readonly width: number,
    private readonly arrowLength: number,
    private readonly arrowWidth: number,
    private readonly arrowOffset: number,
    hasSourceArrow: boolean,
    hasTargetArrow: boolean,
    private readonly roundness: number,
  ) {
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

    const gap = this.arrowLength + this.arrowOffset;
    const gapr = gap - this.roundness;

    const pbl = createRotatedPoint({ x: gapr, y: 0 }, fromVect, { x: 0, y: 0 });
    const pel = createRotatedPoint({ x: width - gapr, y: height }, toVect, {
      x: width,
      y: height,
    });

    const halfH = Math.max((pbl.y + pel.y) / 2, gap);
    const halfW = width / 2;
    const pb1: Point = { x: pbl.x, y: flipY > 0 ? halfH : -gap };
    const pb2: Point = { x: halfW, y: pb1.y };
    const pe1: Point = {
      x: pel.x,
      y: flipY > 0 ? height - halfH : height + gap,
    };
    const pe2: Point = { x: halfW, y: pe1.y };

    const linePath = createRoundedPath(
      [pba, pbl, pb1, pb2, pe2, pe1, pel, pea],
      this.roundness,
    );

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
