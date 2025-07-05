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
import { createDirectArrowPath, createDirectLinePath } from "./utils";

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

    const to: Point = { x: width, y: height };

    const linePath = createDirectLinePath({
      totalDistance,
      to,
      sourceOffset: this.sourceOffset,
      targetOffset: this.targetOffset,
      hasSourceArrow: this.sourceArrow !== null,
      hasTargetArrow: this.targetArrow !== null,
      arrowLength: this.arrowLength,
    });

    this.line.setAttribute("d", linePath);

    if (this.sourceArrow) {
      const arrowPath = createDirectArrowPath({
        totalDistance,
        to,
        offset: this.sourceOffset,
        flip: 1,
        shift: zero,
        arrowWidth: this.arrowWidth,
        arrowLength: this.arrowLength,
      });

      this.sourceArrow.setAttribute("d", arrowPath);
    }

    if (this.targetArrow) {
      const arrowPath = createDirectArrowPath({
        totalDistance,
        to,
        offset: this.targetOffset,
        flip: -1,
        shift: to,
        arrowWidth: this.arrowWidth,
        arrowLength: this.arrowLength,
      });

      this.targetArrow.setAttribute("d", arrowPath);
    }
  }
}
