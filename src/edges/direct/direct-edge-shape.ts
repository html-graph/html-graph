import { EdgeRenderParams } from "../edge-render-params";
import { createEdgeArrow } from "../line/create-edge-arrow";
import { createEdgeGroup } from "../line/create-edge-group";
import { createEdgeLine } from "../line/create-edge-line";
import { createEdgeRectangle } from "../line/create-edge-rectangle";
import { createEdgeSvg } from "../line/create-edge-svg";
import { StructuredEdgeShape } from "../structured-edge-shape";
import { DirectEdgeParams } from "./direct-edge-params";
import { edgeConstants } from "../edge-constants";
import { Point } from "@/point";
import { createArrowPath } from "../line/create-arrow-path";

/**
 * Responsibility: Providing edge shape connecting ports with direct line
 */
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

    console.log(
      this.arrowLength,
      this.arrowWidth,
      this.sourceOffset,
      this.targetOffset,
    );

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

    if (distance === 0) {
      this.renderEmptyEdge();

      return;
    }

    const halfDistance = distance / 2;

    const sourceArrowOffset = this.sourceArrow ? this.arrowLength : 0;
    const sourceArrowEndDistance = Math.min(
      this.sourceOffset + sourceArrowOffset,
      halfDistance,
    );

    const targetArrowOffset = this.targetArrow ? this.arrowLength : 0;
    const targetArrowEndDistance = Math.min(
      this.targetOffset + targetArrowOffset,
      halfDistance,
    );

    const sourceEndRatio = sourceArrowEndDistance / distance;
    const targetEndRatio = 1 - targetArrowEndDistance / distance;

    const sourceArrowEnd: Point = {
      x: width * sourceEndRatio,
      y: height * sourceEndRatio,
    };
    const targetArrowEnd: Point = {
      x: width * targetEndRatio,
      y: height * targetEndRatio,
    };

    const linePath = `M ${sourceArrowEnd.x} ${sourceArrowEnd.y} L ${targetArrowEnd.x} ${targetArrowEnd.y}`;

    this.line.setAttribute("d", linePath);

    if (this.sourceArrow) {
      const sourceArrowStartDistance = Math.min(
        this.sourceOffset,
        halfDistance,
      );

      const sourceStartRatio = sourceArrowStartDistance / distance;

      const sourceArrowStart: Point = {
        x: width * sourceStartRatio,
        y: height * sourceStartRatio,
      };

      const arrowPath = createArrowPath(
        {
          x: sourceArrowStart.x / sourceArrowStartDistance,
          y: sourceArrowStart.y / sourceArrowStartDistance,
        },
        sourceArrowStart,
        this.arrowLength,
        this.arrowWidth,
      );
      this.sourceArrow.setAttribute("d", arrowPath);
    }

    if (this.targetArrow) {
      const targetArrowStartDistance = Math.min(
        this.targetOffset,
        halfDistance,
      );

      const targetStartRatio = targetArrowStartDistance / distance;

      const targetArrowStart: Point = {
        x: width * targetStartRatio,
        y: height * targetStartRatio,
      };

      const arrowPath = createArrowPath(
        {
          x: targetArrowStart.x / targetArrowStartDistance,
          y: targetArrowStart.y / targetArrowStartDistance,
        },
        {
          x: width - targetArrowStart.x,
          y: height - targetArrowStart.y,
        },
        -this.arrowLength,
        this.arrowWidth,
      );
      this.targetArrow.setAttribute("d", arrowPath);
    }
  }

  private renderEmptyEdge(): void {
    this.line.setAttribute("d", "");

    if (this.sourceArrow) {
      this.sourceArrow.setAttribute("d", "");
    }

    if (this.targetArrow) {
      this.targetArrow.setAttribute("d", "");
    }
  }
}
