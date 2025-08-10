import { EdgeRenderParams } from "../../edge-render-params";
import { StructuredEdgeShape } from "../../structured-edge-shape";
import { DirectEdgeParams } from "./direct-edge-params";
import { edgeConstants } from "../../edge-constants";
import { Point } from "@/point";
import { createEdgeRectangle } from "../../geometry";
import { DirectEdgePath } from "../../paths";
import { createPair, EventEmitter, EventHandler } from "@/event-subject";
import { StructuredEdgeRenderModel } from "../../structure-render-model";
import {
  ArrowRenderer,
  createPolygonArrowRenderer,
} from "@/edges/arrow-renderer";
import {
  createEdgeArrow,
  createEdgeGroup,
  createEdgePath,
  createEdgeSvg,
  setSvgRectangle,
} from "../../svg";

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

  public readonly onAfterRender: EventHandler<StructuredEdgeRenderModel>;

  private readonly afterRenderEmitter: EventEmitter<StructuredEdgeRenderModel>;

  private readonly arrowRenderer: ArrowRenderer;

  public constructor(params?: DirectEdgeParams) {
    [this.afterRenderEmitter, this.onAfterRender] =
      createPair<StructuredEdgeRenderModel>();

    this.color = params?.color ?? edgeConstants.color;
    this.width = params?.width ?? edgeConstants.width;
    this.arrowLength = params?.arrowLength ?? edgeConstants.arrowLength;
    this.arrowWidth = params?.arrowWidth ?? edgeConstants.arrowWidth;

    this.arrowRenderer = createPolygonArrowRenderer({
      width: this.arrowWidth,
      length: this.arrowLength,
    });

    this.sourceOffset = params?.sourceOffset ?? edgeConstants.preOffset;
    this.targetOffset = params?.targetOffset ?? edgeConstants.preOffset;

    this.svg = createEdgeSvg(this.color);
    this.svg.appendChild(this.group);
    this.line = createEdgePath(this.width);
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

    const to: Point = { x: width, y: height };

    const edgePath = new DirectEdgePath({
      to,
      sourceOffset: this.sourceOffset,
      targetOffset: this.targetOffset,
      hasSourceArrow: this.sourceArrow !== null,
      hasTargetArrow: this.targetArrow !== null,
      arrowLength: this.arrowLength,
    });

    this.line.setAttribute("d", edgePath.path);

    let sourceArrowPath: string | null = null;
    let targetArrowPath: string | null = null;
    const diagonal = edgePath.diagonalDistance;

    if (diagonal === 0) {
      if (this.sourceArrow !== null) {
        sourceArrowPath = "";
        this.sourceArrow.setAttribute("d", sourceArrowPath);
      }

      if (this.targetArrow !== null) {
        targetArrowPath = "";
        this.targetArrow.setAttribute("d", targetArrowPath);
      }
    } else {
      const direction: Point = {
        x: to.x / diagonal,
        y: to.y / diagonal,
      };

      if (this.sourceArrow) {
        const sourceOffset: Point = {
          x: direction.x * this.sourceOffset,
          y: direction.y * this.sourceOffset,
        };

        sourceArrowPath = this.arrowRenderer(direction, sourceOffset);

        this.sourceArrow.setAttribute("d", sourceArrowPath);
      }

      if (this.targetArrow) {
        const targetOffset: Point = {
          x: direction.x * this.targetOffset,
          y: direction.y * this.targetOffset,
        };

        targetArrowPath = this.arrowRenderer(
          { x: -direction.x, y: -direction.y },
          {
            x: to.x - targetOffset.x,
            y: to.y - targetOffset.y,
          },
        );

        this.targetArrow.setAttribute("d", targetArrowPath);
      }
    }

    this.afterRenderEmitter.emit({
      edgePath,
      sourceArrowPath,
      targetArrowPath,
    });
  }
}
