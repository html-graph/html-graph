import { EdgeShape } from "../edge-shape";
import { zero } from "../zero";
import {
  createArrowPath,
  createFlipDirectionVector,
  createEdgeArrow,
  createEdgeGroup,
  createEdgeSvg,
  createRotatedPoint,
  createEdgeLine,
} from "../utils";
import { createRoundedPath } from "../utils";
import { Point } from "@/point";

export class HorizontalEdgeShape implements EdgeShape {
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

    const linePath = this.createLinePath(to, fromVect, toVect, flipX);

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
    flipX: number,
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
    const halfW = Math.max((pbl.x + pel.x) / 2, gap);
    const halfH = to.y / 2;
    const pb1: Point = { x: flipX > 0 ? halfW : -gap, y: pbl.y };
    const pb2: Point = { x: pb1.x, y: halfH };
    const pe1: Point = { x: flipX > 0 ? to.x - halfW : to.x + gap, y: pel.y };
    const pe2: Point = { x: pe1.x, y: halfH };

    return createRoundedPath(
      [pba, pbl, pb1, pb2, pe2, pe1, pel, pea],
      this.roundness,
    );
  }
}
