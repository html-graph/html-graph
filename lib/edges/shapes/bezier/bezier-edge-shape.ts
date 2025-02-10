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
import { Point, zero } from "@/point";

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

  public render(
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
    const pb = createRotatedPoint(
      { x: this.arrowLength, y: zero.y },
      fromVect,
      zero,
    );

    const pe = createRotatedPoint(
      { x: to.x - this.arrowLength, y: to.y },
      toVect,
      to,
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
    const preLine = this.sourceArrow
      ? ""
      : `M ${zero.x} ${zero.y} L ${pb.x} ${pb.y} `;
    const postLine = this.targetArrow
      ? ""
      : ` M ${pe.x} ${pe.y} L ${to.x} ${to.y}`;

    return `${preLine}${lcurve}${postLine}`;
  }
}
