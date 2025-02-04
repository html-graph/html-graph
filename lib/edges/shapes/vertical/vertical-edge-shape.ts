import { EdgeShape } from "../edge-shape";
import { Point, zero } from "@/point";
import {
  createArrowPath,
  createFlipDirectionVector,
  createEdgeArrow,
  createEdgeGroup,
  createEdgeSvg,
  createRotatedPoint,
  createRoundedPath,
  createEdgeLine,
} from "../utils";

export class VerticalEdgeShape implements EdgeShape {
  public readonly svg = createEdgeSvg();

  private readonly group = createEdgeGroup();

  private readonly line: SVGPathElement;

  private readonly sourceArrow: SVGPathElement | null = null;

  private readonly targetArrow: SVGPathElement | null = null;

  public constructor(
    color: string,
    width: number,
    private readonly arrowLength: number,
    private readonly arrowWidth: number,
    private readonly arrowOffset: number,
    hasSourceArrow: boolean,
    hasTargetArrow: boolean,
    private readonly roundness: number,
  ) {
    this.svg.appendChild(this.group);
    this.line = createEdgeLine(color, width);
    this.group.appendChild(this.line);

    if (hasSourceArrow) {
      this.sourceArrow = createEdgeArrow(color);
      this.group.appendChild(this.sourceArrow);
    }

    if (hasTargetArrow) {
      this.targetArrow = createEdgeArrow(color);
      this.group.appendChild(this.targetArrow);
    }
  }

  public update(
    to: Point,
    flipX: number,
    flipY: number,
    fromDir: number,
    toDir: number,
  ): void {
    this.group.style.transform = `scale(${flipX}, ${flipY})`;

    const fromVect = createFlipDirectionVector(fromDir, flipX, flipY);
    const toVect = createFlipDirectionVector(toDir, flipX, flipY);

    const linePath = this.createLinePath(to, fromVect, toVect, flipY);

    this.line.setAttribute("d", linePath);

    if (this.sourceArrow) {
      const arrowPath = createArrowPath(
        fromVect,
        zero,
        this.arrowLength,
        this.arrowWidth,
      );

      this.sourceArrow.setAttribute("d", arrowPath);
    }

    if (this.targetArrow) {
      const arrowPath = createArrowPath(
        toVect,
        to,
        -this.arrowLength,
        this.arrowWidth,
      );

      this.targetArrow.setAttribute("d", arrowPath);
    }
  }

  private createLinePath(
    to: Point,
    fromVect: Point,
    toVect: Point,
    flipY: number,
  ): string {
    const pba: Point = this.sourceArrow
      ? createRotatedPoint({ x: this.arrowLength, y: zero.y }, fromVect, zero)
      : zero;
    const pea: Point = this.targetArrow
      ? createRotatedPoint({ x: to.x - this.arrowLength, y: to.y }, toVect, to)
      : to;

    const gap = this.arrowLength + this.arrowOffset;
    const gapr = gap - this.roundness;

    const pbl = createRotatedPoint({ x: gapr, y: zero.y }, fromVect, zero);
    const pel = createRotatedPoint({ x: to.x - gapr, y: to.y }, toVect, to);

    const halfH = Math.max((pbl.y + pel.y) / 2, gap);
    const halfW = to.x / 2;
    const pb1: Point = { x: pbl.x, y: flipY > 0 ? halfH : -gap };
    const pb2: Point = { x: halfW, y: pb1.y };
    const pe1: Point = {
      x: pel.x,
      y: flipY > 0 ? to.y - halfH : to.y + gap,
    };
    const pe2: Point = { x: halfW, y: pe1.y };

    return createRoundedPath(
      [pba, pbl, pb1, pb2, pe2, pe1, pel, pea],
      this.roundness,
    );
  }
}
