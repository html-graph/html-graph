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
    width: number,
    height: number,
    flipX: number,
    flipY: number,
    fromDir: number,
    toDir: number,
  ): void {
    this.group.style.transform = `scale(${flipX}, ${flipY})`;

    const fromVect = createFlipDirectionVector(fromDir, flipX, flipY);
    const toVect = createFlipDirectionVector(toDir, flipX, flipY);

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

    const gap1 = this.arrowLength + this.arrowOffset;

    const pbl1: Point = createRotatedPoint({ x: gap1, y: 0 }, fromVect, {
      x: 0,
      y: 0,
    });

    const flipDetourX = this.detourX * flipX;
    const flipDetourY = this.detourY * flipY;

    const pbl2: Point = { x: pbl1.x + flipDetourX, y: pbl1.y + flipDetourY };
    const pel1: Point = createRotatedPoint(
      { x: width - gap1, y: height },
      toVect,
      {
        x: width,
        y: height,
      },
    );
    const pel2: Point = { x: pel1.x + flipDetourX, y: pel1.y + flipDetourY };

    const linePath = createRoundedPath(
      [pba, pbl1, pbl2, pel2, pel1, pea],
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
