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

// Responsibility: Providing edge shape connecting ports with direct line
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

    const distance = Math.max(Math.sqrt(width * width + height * height), 1);

    const to: Point = {
      x: width,
      y: height,
    };

    this.renderLine(distance, to);

    if (this.sourceArrow) {
      const arrowPath = this.createArrowPath(
        distance,
        to,
        1,
        zero,
        this.sourceOffset,
      );

      this.sourceArrow.setAttribute("d", arrowPath);
    }

    if (this.targetArrow) {
      const arrowPath = this.createArrowPath(
        distance,
        to,
        -1,
        to,
        this.targetOffset,
      );

      this.targetArrow.setAttribute("d", arrowPath);
    }
  }

  private renderLine(distance: number, to: Point): void {
    const minOffset = distance / 2;

    const sourceDistance = this.calculatePoint(
      this.sourceArrow !== null,
      minOffset,
    );
    const targetDistance = this.calculatePoint(
      this.targetArrow !== null,
      minOffset,
    );

    const sourceRatio = sourceDistance / distance;
    const source: Point = {
      x: to.x * sourceRatio,
      y: to.y * sourceRatio,
    };

    const targetRatio = 1 - targetDistance / distance;
    const target: Point = {
      x: to.x * targetRatio,
      y: to.y * targetRatio,
    };

    const linePath = `M ${source.x} ${source.y} L ${target.x} ${target.y}`;

    this.line.setAttribute("d", linePath);
  }

  private calculatePoint(hasArrow: boolean, minOffset: number): number {
    const targetArrowOffset = hasArrow ? this.arrowLength : 0;

    return Math.min(this.targetOffset + targetArrowOffset, minOffset);
  }

  private createArrowPath(
    distance: number,
    to: Point,
    flip: number,
    shift: Point,
    offset: number,
  ): string {
    const minOffset = Math.max(offset, 1);

    const startRatio = minOffset / distance;

    const arrowStart: Point = {
      x: flip * to.x * startRatio,
      y: flip * to.y * startRatio,
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
