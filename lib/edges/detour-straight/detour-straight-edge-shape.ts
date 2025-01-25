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

export class DetourStraightEdgeShape implements EdgeShape {
  public readonly svg = createEdgeSvg();

  private readonly group = createEdgeGroup();

  private readonly line: SVGPathElement;

  private readonly sourceArrow: SVGPathElement | null = null;

  private readonly targetArrow: SVGPathElement | null = null;

  private readonly detourX: number;

  private readonly detourY: number;

  public constructor(
    color: string,
    width: number,
    private readonly arrowLength: number,
    private readonly arrowWidth: number,
    private readonly arrowOffset: number,
    hasSourceArrow: boolean,
    hasTargetArrow: boolean,
    private readonly roundness: number,
    detourDistance: number,
    detourDirection: number,
  ) {
    this.detourX = Math.cos(detourDirection) * detourDistance;
    this.detourY = Math.sin(detourDirection) * detourDistance;

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

    const linePath = this.createLinePath(to, fromVect, toVect, flipX, flipY);

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
    flipY: number,
  ): string {
    const pba: Point = this.sourceArrow
      ? createRotatedPoint({ x: this.arrowLength, y: zero.y }, fromVect, zero)
      : zero;
    const pea: Point = this.targetArrow
      ? createRotatedPoint({ x: to.x - this.arrowLength, y: to.y }, toVect, to)
      : to;

    const gap1 = this.arrowLength + this.arrowOffset;

    const pbl1: Point = createRotatedPoint(
      { x: gap1, y: zero.y },
      fromVect,
      zero,
    );

    const flipDetourX = this.detourX * flipX;
    const flipDetourY = this.detourY * flipY;

    const pbl2: Point = { x: pbl1.x + flipDetourX, y: pbl1.y + flipDetourY };
    const pel1: Point = createRotatedPoint(
      { x: to.x - gap1, y: to.y },
      toVect,
      to,
    );
    const pel2: Point = { x: pel1.x + flipDetourX, y: pel1.y + flipDetourY };

    return createRoundedPath(
      [pba, pbl1, pbl2, pel2, pel1, pea],
      this.roundness,
    );
  }
}
