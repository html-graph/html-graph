import { EdgeRenderParams } from "../edge-render-params";
import { StructuredEdgeShape } from "../structured-edge-shape";
import { DirectEdgeParams } from "./direct-edge-params";
import { edgeConstants } from "../edge-constants";
import { Point, zero } from "@/point";
import {
  createEdgeArrow,
  createEdgeGroup,
  createEdgeLine,
  createEdgeRectangle,
  createEdgeSvg,
  DirectLine,
  setSvgRectangle,
} from "../shared";
import { createDirectArrowPath } from "./create-direct-arrow-path";

// Responsibility: Connecting ports with direct line
export class DirectEdgeShape implements StructuredEdgeShape {
  public readonly svg: SVGSVGElement;

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

  public constructor(params?: DirectEdgeParams) {
    this.color = params?.color ?? edgeConstants.color;
    this.width = params?.width ?? edgeConstants.width;
    this.arrowLength = params?.arrowLength ?? edgeConstants.arrowLength;
    this.arrowWidth = params?.arrowWidth ?? edgeConstants.arrowWidth;
    this.sourceOffset = params?.sourceOffset ?? edgeConstants.preOffset;
    this.targetOffset = params?.targetOffset ?? edgeConstants.preOffset;

    this.svg = createEdgeSvg(this.color);
    this.svg.appendChild(this.group);
    this.line = createEdgeLine(this.width);
    this.group.appendChild(this.line);

    if (params?.hasSourceArrow) {
      this.sourceArrow = createEdgeArrow();
      this.group.appendChild(this.sourceArrow);
    }

    if (params?.hasTargetArrow) {
      this.targetArrow = createEdgeArrow();
      this.group.appendChild(this.targetArrow);
    }
  }

  public render(params: EdgeRenderParams): void {
    const { x, y, width, height, flipX, flipY } = createEdgeRectangle(
      params.from,
      params.to,
    );

    setSvgRectangle(this.svg, { x, y, width, height });
    this.group.style.transform = `scale(${flipX}, ${flipY})`;

    const diagonalDistance = Math.sqrt(width * width + height * height);
    const to: Point = { x: width, y: height };

    if (diagonalDistance > 0) {
      const linePath = new DirectLine({
        diagonalDistance,
        to,
        sourceOffset: this.sourceOffset,
        targetOffset: this.targetOffset,
        hasSourceArrow: this.sourceArrow !== null,
        hasTargetArrow: this.targetArrow !== null,
        arrowLength: this.arrowLength,
      });

      this.line.setAttribute("d", linePath.getPath());
    } else {
      this.line.setAttribute("d", "");
    }

    if (this.sourceArrow) {
      const arrowPath = createDirectArrowPath({
        diagonalDistance,
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
        diagonalDistance,
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
