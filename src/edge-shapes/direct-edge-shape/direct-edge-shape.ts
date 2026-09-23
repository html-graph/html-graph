import {
  EdgeRenderParams,
  StructuredEdgeShape,
  edgeConstants,
  createEdgeRectangle,
  ArrowRenderer,
  resolveArrowRenderer,
  StructuredEdgeRenderModel,
  setSvgRectangle,
  svgPadding,
  StructuredView,
} from "../shared";
import { DirectEdgeParams } from "./direct-edge-params";
import { Point } from "@/point";
import { createPair, EventEmitter, EventHandler } from "@/event-subject";
import { PortOffsetFn, resolvePortOffsetFn } from "./resolve-port-offset-fn";

const defaultPortOffset = edgeConstants.portOffset;

export class DirectEdgeShape implements StructuredEdgeShape {
  public readonly element: SVGSVGElement;

  /**
   * @deprecated
   * use view.group instead
   */
  public readonly group: SVGGElement;

  /**
   * @deprecated
   * use view.line instead
   */
  public readonly line: SVGPathElement;

  /**
   * @deprecated
   * use view.sourceArrow instead
   */
  public readonly sourceArrow: SVGPathElement | null = null;

  /**
   * @deprecated
   * use view.targetArrow instead
   */
  public readonly targetArrow: SVGPathElement | null = null;

  public readonly view: StructuredView;

  private readonly arrowLength: number;

  private readonly sourceOffsetFn: PortOffsetFn;

  private readonly targetOffsetFn: PortOffsetFn;

  public readonly onAfterRender: EventHandler<StructuredEdgeRenderModel>;

  private readonly afterRenderEmitter: EventEmitter<StructuredEdgeRenderModel>;

  private readonly arrowRenderer: ArrowRenderer;

  public constructor(params?: DirectEdgeParams | undefined) {
    this.view = new StructuredView({
      color: params?.color ?? edgeConstants.color,
      width: params?.width ?? edgeConstants.width,
      hasSourceArrow: params?.hasSourceArrow === true,
      hasTargetArrow: params?.hasTargetArrow === true,
    });

    [this.afterRenderEmitter, this.onAfterRender] =
      createPair<StructuredEdgeRenderModel>();

    this.arrowLength = params?.arrowLength ?? edgeConstants.arrowLength;
    this.arrowRenderer = resolveArrowRenderer(params?.arrowRenderer ?? {});

    this.sourceOffsetFn = resolvePortOffsetFn(
      params?.sourceOffset ?? defaultPortOffset,
    );

    this.targetOffsetFn = resolvePortOffsetFn(
      params?.targetOffset ?? defaultPortOffset,
    );

    this.element = this.view.element;
    this.line = this.view.line;
    this.group = this.view.group;
    this.sourceArrow = this.view.sourceArrow;
    this.targetArrow = this.view.targetArrow;
  }

  public render(params: EdgeRenderParams): void {
    const { x, y, width, height, from, to } = createEdgeRectangle(
      params.from,
      params.to,
      svgPadding,
    );

    setSvgRectangle(this.element, { x, y, width, height });

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

    const diagonalSource =
      this.view.sourceArrow !== null ? this.arrowLength : 0;

    const sourceLine: Point = {
      x: source.x + diagonalSource * direction.x,
      y: source.y + diagonalSource * direction.y,
    };

    const diagonalTarget =
      this.view.targetArrow !== null ? this.arrowLength : 0;

    const targetLine: Point = {
      x: target.x - diagonalTarget * direction.x,
      y: target.y - diagonalTarget * direction.y,
    };

    const midpoint: Point = {
      x: (source.x + target.x) / 2,
      y: (source.y + target.y) / 2,
    };

    const path = `M ${sourceLine.x} ${sourceLine.y} L ${targetLine.x} ${targetLine.y}`;
    this.view.line.setAttribute("d", path);

    let sourceArrowPath: string | null = null;
    let targetArrowPath: string | null = null;

    if (this.view.sourceArrow !== null) {
      const sourceOffsetPoint: Point = {
        x: direction.x * sourceOffset + from.x,
        y: direction.y * sourceOffset + from.y,
      };

      sourceArrowPath = this.arrowRenderer({
        direction,
        shift: sourceOffsetPoint,
        arrowLength: this.arrowLength,
      });

      this.view.sourceArrow.setAttribute("d", sourceArrowPath);
    }

    if (this.view.targetArrow !== null) {
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

      this.view.targetArrow.setAttribute("d", targetArrowPath);
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

    this.view.line.setAttribute("d", emptyPath);

    if (this.view.sourceArrow !== null) {
      sourceArrowPath = "";
      this.view.sourceArrow.setAttribute("d", sourceArrowPath);
    }

    if (this.view.targetArrow !== null) {
      targetArrowPath = "";
      this.view.targetArrow.setAttribute("d", targetArrowPath);
    }

    this.afterRenderEmitter.emit({
      edgePath: { path: emptyPath, midpoint },
      sourceArrowPath,
      targetArrowPath,
    });
  }
}
