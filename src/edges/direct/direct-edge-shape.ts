import { EdgeRenderParams } from "../edge-render-params";
import { createEdgeArrow } from "../line/create-edge-arrow";
import { createEdgeGroup } from "../line/create-edge-group";
import { createEdgeLine } from "../line/create-edge-line";
import { createEdgeRectangle } from "../line/create-edge-rectangle";
import { createEdgeSvg } from "../line/create-edge-svg";
import { StructuredEdgeShape } from "../structured-edge-shape";
import { DirectEdgeParams } from "./direct-edge-params";
import { edgeConstants } from "../edge-constants";

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

  private readonly sourceArrowOffset: number;

  private readonly targetArrowOffset: number;

  public constructor(params: DirectEdgeParams) {
    this.color = params.color ?? edgeConstants.color;
    this.width = params.width ?? edgeConstants.width;
    this.arrowLength = params.arrowLength ?? edgeConstants.arrowLength;
    this.arrowWidth = params.arrowWidth ?? edgeConstants.arrowWidth;
    this.sourceArrowOffset =
      params.sourceArrowOffset ?? edgeConstants.preArrowOffset;
    this.targetArrowOffset =
      params.targetArrowOffset ?? edgeConstants.preArrowOffset;

    console.log(
      this.arrowLength,
      this.arrowWidth,
      this.sourceArrowOffset,
      this.targetArrowOffset,
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

    console.log(distance);

    this.line.setAttribute("d", `M 0 0 L ${width} ${height}`);

    if (this.sourceArrow) {
      this.sourceArrow.setAttribute("d", "");
    }

    if (this.targetArrow) {
      this.targetArrow.setAttribute("d", "");
    }
  }
}
