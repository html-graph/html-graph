import { EdgeShape } from "../edge-shape";
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
import { Point, zero } from "@/point";

export class StraightEdgeShape implements EdgeShape {
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

    const linePath = this.createLinePath(to, fromVect, toVect);

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

  private createLinePath(to: Point, fromVect: Point, toVect: Point): string {
    const pba: Point = this.sourceArrow
      ? createRotatedPoint({ x: this.arrowLength, y: zero.y }, fromVect, zero)
      : zero;
    const pea: Point = this.targetArrow
      ? createRotatedPoint({ x: to.x - this.arrowLength, y: to.y }, toVect, to)
      : to;

    const gap = this.arrowLength + this.arrowOffset;

    const pbl = createRotatedPoint({ x: gap, y: zero.y }, fromVect, zero);
    const pel = createRotatedPoint({ x: to.x - gap, y: to.y }, toVect, to);

    return createRoundedPath([pba, pbl, pel, pea], this.roundness);
  }
}
