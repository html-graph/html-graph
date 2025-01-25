import { EdgeShape } from "../edge-shape";
import {
  createArrowPath,
  createFlipDirectionVector,
  createEdgeArrow,
  createEdgeGroup,
  createEdgeSvg,
  createRotatedPoint,
  createEdgeLine,
  createDirectionVector,
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
    width: number,
    height: number,
    flipX: number,
    flipY: number,
    fromDir: number,
    toDir: number,
  ): void {
    this.group.style.transform = `scale(${flipX}, ${flipY})`;

    const fromVect = createFlipDirectionVector(
      createDirectionVector(fromDir),
      flipX,
      flipY,
    );
    const toVect = createFlipDirectionVector(
      createDirectionVector(toDir),
      flipX,
      flipY,
    );

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
    const halfW = Math.max((pbl.x + pel.x) / 2, gap);
    const halfH = height / 2;
    const pb1: Point = { x: flipX > 0 ? halfW : -gap, y: pbl.y };
    const pb2: Point = { x: pb1.x, y: halfH };
    const pe1: Point = { x: flipX > 0 ? width - halfW : width + gap, y: pel.y };
    const pe2: Point = { x: pe1.x, y: halfH };

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
