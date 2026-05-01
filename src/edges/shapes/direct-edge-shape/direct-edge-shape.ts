import { EdgeRenderParams } from "../../edge-render-params";
import { StructuredEdgeShape } from "../../structured-edge-shape";
import { DirectEdgeParams } from "./direct-edge-params";
import { edgeConstants } from "../../edge-constants";
import { Point } from "@/point";
import { createEdgeRectangle } from "../../geometry";
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

const defaultPortOffset = edgeConstants.portOffset;

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
      params?.sourceOffset ?? defaultPortOffset,
    );

    this.targetOffsetFn = resolvePortOffsetFn(
      params?.targetOffset ?? defaultPortOffset,
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

    const sourceOffset = this.sourceOffsetFn({
      direction: { x: direction.x, y: direction.y },
      radius: {
        horizontal: params.from.width / 2,
        vertical: params.from.height / 2,
      },
    });

    const targetOffset = this.targetOffsetFn({
      direction: { x: -direction.x, y: -direction.y },
      radius: {
        horizontal: params.to.width / 2,
        vertical: params.to.height / 2,
      },
    });

    const source: Point = {
      x: from.x + sourceOffset * direction.x,
      y: from.y + sourceOffset * direction.y,
    };

    const target: Point = {
      x: to.x - targetOffset * direction.x,
      y: to.y - targetOffset * direction.y,
    };

    const diagonalSource = this.sourceArrow !== null ? this.arrowLength : 0;

    const sourceLine: Point = {
      x: source.x + diagonalSource * direction.x,
      y: source.y + diagonalSource * direction.y,
    };

    const diagonalTarget = this.targetArrow !== null ? this.arrowLength : 0;

    const targetLine: Point = {
      x: target.x - diagonalTarget * direction.x,
      y: target.y - diagonalTarget * direction.y,
    };

    const midpoint: Point = {
      x: (source.x + target.x) / 2,
      y: (source.y + target.y) / 2,
    };

    const path = `M ${sourceLine.x} ${sourceLine.y} L ${targetLine.x} ${targetLine.y}`;
    this.line.setAttribute("d", path);

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
      edgePath: { path, midpoint },
      sourceArrowPath,
      targetArrowPath,
    });
  }

  private renderEmpty(midpoint: Point): void {
    const emptyPath = "";
    let sourceArrowPath: string | null = null;
    let targetArrowPath: string | null = null;

    this.line.setAttribute("d", emptyPath);

    if (this.sourceArrow !== null) {
      sourceArrowPath = "";
      this.sourceArrow.setAttribute("d", sourceArrowPath);
    }

    if (this.targetArrow !== null) {
      targetArrowPath = "";
      this.targetArrow.setAttribute("d", targetArrowPath);
    }

    this.afterRenderEmitter.emit({
      edgePath: { path: emptyPath, midpoint },
      sourceArrowPath,
      targetArrowPath,
    });
  }
}
