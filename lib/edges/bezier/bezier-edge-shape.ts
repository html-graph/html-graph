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
import { Point } from "@/point";

export class BezierEdgeShape implements EdgeShape {
  public readonly svg = createEdgeSvg();

  private readonly group = createEdgeGroup();

  private readonly line: SVGPathElement;

  private readonly sourceArrow: SVGPathElement | null = null;

  private readonly targetArrow: SVGPathElement | null = null;

  public constructor(
    color: string,
    width: number,
    private readonly curvature: number,
    private readonly arrowLength: number,
    private readonly arrowWidth: number,
    hasSourceArrow: boolean,
    hasTargetArrow: boolean,
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

    const linePath = this.createLinePath(fromVect, toVect, width, height);
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

  private createLinePath(
    fromVect: Point,
    toVect: Point,
    width: number,
    height: number,
  ): string {
    const pb = createRotatedPoint({ x: this.arrowLength, y: 0 }, fromVect, {
      x: 0,
      y: 0,
    });

    const pe = createRotatedPoint(
      { x: width - this.arrowLength, y: height },
      toVect,
      {
        x: width,
        y: height,
      },
    );

    const bpb: Point = {
      x: pb.x + fromVect.x * this.curvature,
      y: pb.y + fromVect.y * this.curvature,
    };

    const bpe: Point = {
      x: pe.x - toVect.x * this.curvature,
      y: pe.y - toVect.y * this.curvature,
    };

    const lcurve = `M ${pb.x} ${pb.y} C ${bpb.x} ${bpb.y}, ${bpe.x} ${bpe.y}, ${pe.x} ${pe.y}`;
    const preLine = this.sourceArrow ? "" : `M ${0} ${0} L ${pb.x} ${pb.y} `;
    const postLine = this.targetArrow
      ? ""
      : ` M ${pe.x} ${pe.y} L ${width} ${height}`;

    return `${preLine}${lcurve}${postLine}`;
  }
}
