import { EdgeRenderParams } from "../edge-render-params";
import { createEdgeArrow } from "../line/create-edge-arrow";
import { createEdgeGroup } from "../line/create-edge-group";
import { createEdgeLine } from "../line/create-edge-line";
import { createEdgeRectangle } from "../line/create-edge-rectangle";
import { createEdgeSvg } from "../line/create-edge-svg";
import { StructuredEdgeShape } from "../structured-edge-shape";
import { DirectEdgeParams } from "./direct-edge-params";
import { edgeConstants } from "../edge-constants";
import { Point, zero } from "@/point";
import { createArrowPath } from "../line/create-arrow-path";

// Responsibility: Connecting ports with direct line
export class DirectEdgeShape implements StructuredEdgeShape {
  public readonly svg = createEdgeSvg();

  public readonly group = createEdgeGroup();

  public readonly line: SVGPathElement;

  public readonly sourceArrow: SVGPathElement | null = null;

  public readonly targetArrow: SVGPathElement | null = null;

  private readonly color: string;

  private readonly width: number;

  private readonly arrowLength: number;

  private readonly arrowWidth: number;

  private readonly sourceOffset: number;

  private readonly targetOffset: number;

  public constructor(params: DirectEdgeParams) {
    this.color = params.color ?? edgeConstants.color;
    this.width = params.width ?? edgeConstants.width;
    this.arrowLength = params.arrowLength ?? edgeConstants.arrowLength;
    this.arrowWidth = params.arrowWidth ?? edgeConstants.arrowWidth;
    this.sourceOffset = params.sourceOffset ?? edgeConstants.preOffset;
    this.targetOffset = params.targetOffset ?? edgeConstants.preOffset;

    this.svg.appendChild(this.group);
    this.line = createEdgeLine(this.color, this.width);
    this.group.appendChild(this.line);

    if (params.hasSourceArrow) {
      this.sourceArrow = createEdgeArrow(this.color);
      this.group.appendChild(this.sourceArrow);
    }

    if (params.hasTargetArrow) {
      this.targetArrow = createEdgeArrow(this.color);
      this.group.appendChild(this.targetArrow);
    }
  }

  public render(params: EdgeRenderParams): void {
    const { x, y, width, height, flipX, flipY } = createEdgeRectangle(
      params.from,
      params.to,
    );

    this.svg.style.transform = `translate(${x}px, ${y}px)`;
    this.svg.style.width = `${Math.max(width, 1)}px`;
    this.svg.style.height = `${Math.max(height, 1)}px`;
    this.group.style.transform = `scale(${flipX}, ${flipY})`;

    const distance = Math.sqrt(width * width + height * height);
    const totalDistance = Math.max(distance, 1);

    const to: Point = {
      x: width,
      y: height,
    };

    const linePath = this.createDirectLinePath(totalDistance, to);

    this.line.setAttribute("d", linePath);

    if (this.sourceArrow) {
      const arrowPath = this.createDirectArrowPath(
        totalDistance,
        to,
        1,
        zero,
        this.sourceOffset,
      );

      this.sourceArrow.setAttribute("d", arrowPath);
    }

    if (this.targetArrow) {
      const arrowPath = this.createDirectArrowPath(
        totalDistance,
        to,
        -1,
        to,
        this.targetOffset,
      );

      this.targetArrow.setAttribute("d", arrowPath);
    }
  }

  private createDirectLinePath(totalDistance: number, to: Point): string {
    const source = this.createDirectLinePoint(
      totalDistance,
      to,
      1,
      zero,
      this.sourceArrow !== null,
      this.sourceOffset,
    );

    const target = this.createDirectLinePoint(
      totalDistance,
      to,
      -1,
      to,
      this.targetArrow !== null,
      this.targetOffset,
    );

    return `M ${source.x} ${source.y} L ${target.x} ${target.y}`;
  }

  private createDirectLinePoint(
    totalDistance: number,
    to: Point,
    flip: number,
    shift: Point,
    hasArrow: boolean,
    offset: number,
  ): Point {
    const totalOffset = this.calculateArrowEndOffset(hasArrow, offset);
    const targetRatio = (flip * totalOffset) / totalDistance;

    return {
      x: shift.x + to.x * targetRatio,
      y: shift.y + to.y * targetRatio,
    };
  }

  private calculateArrowEndOffset(hasArrow: boolean, offset: number): number {
    const arrowOffset = hasArrow ? this.arrowLength : 0;

    return offset + arrowOffset;
  }

  private createDirectArrowPath(
    totalDistance: number,
    to: Point,
    flip: number,
    shift: Point,
    offset: number,
  ): string {
    const minOffset = Math.max(offset, 1);
    const ratio = minOffset / totalDistance;

    const arrowStart: Point = {
      x: flip * to.x * ratio,
      y: flip * to.y * ratio,
    };

    return createArrowPath(
      {
        x: arrowStart.x / minOffset,
        y: arrowStart.y / minOffset,
      },
      {
        x: arrowStart.x + shift.x,
        y: arrowStart.y + shift.y,
      },
      this.arrowLength,
      this.arrowWidth,
    );
  }
}
