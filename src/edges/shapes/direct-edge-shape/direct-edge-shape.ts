import { EdgeRenderParams } from "../../edge-render-params";
import { StructuredEdgeShape } from "../../structured-edge-shape";
import { DirectEdgeParams } from "./direct-edge-params";
import { edgeConstants } from "../../edge-constants";
import { Point } from "@/point";
import { createEdgeRectangle } from "../../geometry";
import { DirectEdgePath } from "../../paths";
import { createPair, EventEmitter, EventHandler } from "@/event-subject";
import { StructuredEdgeRenderModel } from "../../structure-render-model";
import { ArrowRenderer, resolveArrowRenderer } from "@/edges/arrow-renderer";
import {
  createEdgeArrow,
  createEdgePath,
  createEdgeSvg,
  setSvgRectangle,
} from "../../svg";
import { svgPadding } from "../../svg-padding";
import { PortOffsetFn, resolvePortOffsetFn } from "./resolve-port-offset-fn";

export class DirectEdgeShape implements StructuredEdgeShape {
  public readonly svg: SVGSVGElement;

  public readonly group = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "g",
  );

  public readonly line: SVGPathElement;

  public readonly sourceArrow: SVGPathElement | null = null;

  public readonly targetArrow: SVGPathElement | null = null;

  private readonly color: string;

  private readonly width: number;

  private readonly arrowLength: number;

  private readonly sourceOffsetFn: PortOffsetFn;

  private readonly targetOffsetFn: PortOffsetFn;

  public readonly onAfterRender: EventHandler<StructuredEdgeRenderModel>;

  private readonly afterRenderEmitter: EventEmitter<StructuredEdgeRenderModel>;

  private readonly arrowRenderer: ArrowRenderer;

  public constructor(params?: DirectEdgeParams) {
    [this.afterRenderEmitter, this.onAfterRender] =
      createPair<StructuredEdgeRenderModel>();

    this.color = params?.color ?? edgeConstants.color;
    this.width = params?.width ?? edgeConstants.width;
    this.arrowLength = params?.arrowLength ?? edgeConstants.arrowLength;
    this.arrowRenderer = resolveArrowRenderer(params?.arrowRenderer ?? {});
    this.sourceOffsetFn = resolvePortOffsetFn(
      params?.sourceOffset ?? edgeConstants.portOffset,
    );
    this.targetOffsetFn = resolvePortOffsetFn(
      params?.targetOffset ?? edgeConstants.portOffset,
    );

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
    const { x, y, width, height, from, to } = createEdgeRectangle(
      params.from,
      params.to,
      svgPadding,
    );

    setSvgRectangle(this.svg, { x, y, width, height });

    const dirX = to.x - from.x;
    const dirY = to.y - from.y;

    const diagonal = Math.sqrt(dirX * dirX + dirY * dirY);

    if (diagonal === 0) {
      this.renderEmpty(from);
      return;
    }

    const direction: Point = { x: dirX / diagonal, y: dirY / diagonal };

    const sourceOffset = this.sourceOffsetFn(
      { x: direction.x, y: direction.y },
      { width: params.from.width / 2, height: params.from.height / 2 },
    );

    const targetOffset = this.targetOffsetFn(
      { x: -direction.x, y: -direction.y },
      { width: params.to.width / 2, height: params.to.height / 2 },
    );

    const edgePath = new DirectEdgePath({
      from,
      to,
      sourceOffset,
      targetOffset,
      hasSourceArrow: this.sourceArrow !== null,
      hasTargetArrow: this.targetArrow !== null,
      arrowLength: this.arrowLength,
      diagonal,
      direction,
    });

    this.line.setAttribute("d", edgePath.path);

    let sourceArrowPath: string | null = null;
    let targetArrowPath: string | null = null;

    if (this.sourceArrow) {
      const sourceOffsetPoint: Point = {
        x: direction.x * sourceOffset + from.x,
        y: direction.y * sourceOffset + from.y,
      };

      sourceArrowPath = this.arrowRenderer({
        direction: direction,
        shift: sourceOffsetPoint,
        arrowLength: this.arrowLength,
      });

      this.sourceArrow.setAttribute("d", sourceArrowPath);
    }

    if (this.targetArrow) {
      const targetOffsetPoint: Point = {
        x: direction.x * targetOffset,
        y: direction.y * targetOffset,
      };

      targetArrowPath = this.arrowRenderer({
        direction: { x: -direction.x, y: -direction.y },
        shift: {
          x: to.x - targetOffsetPoint.x,
          y: to.y - targetOffsetPoint.y,
        },
        arrowLength: this.arrowLength,
      });

      this.targetArrow.setAttribute("d", targetArrowPath);
    }

    this.afterRenderEmitter.emit({
      edgePath,
      sourceArrowPath,
      targetArrowPath,
    });
  }

  private renderEmpty(midpoint: Point): void {
    this.line.setAttribute("d", "");

    if (this.sourceArrow !== null) {
      this.sourceArrow.setAttribute("d", "");
    }

    if (this.targetArrow !== null) {
      this.targetArrow.setAttribute("d", "");
    }

    this.afterRenderEmitter.emit({
      edgePath: { path: "", midpoint },
      sourceArrowPath: "",
      targetArrowPath: "",
    });
  }
}
