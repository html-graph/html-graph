import { PortPayload } from "@/port-payload";
import { EdgeShape } from "../edge-shape";
import {
  createArrowPath,
  createDirectionVector,
  createPortCenter,
  createRotatedPoint,
} from "../utils";
import { createRoundedPath } from "../utils/create-rounded-path";
import { Point } from "../point";

export class HorizontalEdgeShape implements EdgeShape {
  public readonly svg: SVGSVGElement;

  private readonly group: SVGGElement;

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

    this.svg.style.overflow = "visible";
  }

  public update(
    x: number,
    y: number,
    width: number,
    height: number,
    from: PortPayload,
    to: PortPayload,
  ): void {
    this.svg.style.width = `${width}px`;
    this.svg.style.height = `${height}px`;

    const fromCenter = createPortCenter(from);
    const toCenter = createPortCenter(to);
    const flipX = fromCenter[0] <= toCenter[0] ? 1 : -1;
    const flipY = fromCenter[1] <= toCenter[1] ? 1 : -1;

    this.svg.style.transform = `translate(${x}px, ${y}px)`;
    this.group.style.transform = `scale(${flipX}, ${flipY})`;

    const fromVect = createDirectionVector(from.direction, flipX, flipY);
    const toVect = createDirectionVector(to.direction, flipX, flipY);

    const pba: Point = this.sourceArrow
      ? createRotatedPoint([this.arrowLength, 0], fromVect, [0, 0])
      : [0, 0];
    const pea: Point = this.targetArrow
      ? createRotatedPoint([width - this.arrowLength, height], toVect, [
          width,
          height,
        ])
      : [width, height];

    const gap = this.arrowLength + this.arrowOffset;

    const pbl = createRotatedPoint([gap, 0], fromVect, [0, 0]);
    const pel = createRotatedPoint([width - gap, height], toVect, [
      width,
      height,
    ]);
    const halfW = Math.max((pbl[0] + pel[0]) / 2, gap);
    const halfH = height / 2;
    const pb1: Point = [flipX > 0 ? halfW : -gap, pbl[1]];
    const pb2: Point = [pb1[0], halfH];
    const pe1: Point = [flipX > 0 ? width - halfW : width + gap, pel[1]];
    const pe2: Point = [pe1[0], halfH];

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
