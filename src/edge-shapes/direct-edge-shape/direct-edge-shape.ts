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
import { DirectEdgeShapeModel } from "./direct-edge-shape-model";

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

  /**
   * @deprecated
   * use onModelChange instead
   */
  public readonly onAfterRender: EventHandler<StructuredEdgeRenderModel>;

  private readonly afterRenderEmitter: EventEmitter<StructuredEdgeRenderModel>;

  public readonly onModelChange: EventHandler<DirectEdgeShapeModel>;

  private readonly modelChangeEmitter: EventEmitter<DirectEdgeShapeModel>;

  private readonly arrowRenderer: ArrowRenderer;

  private readonly hasSourceArrow: boolean;

  private readonly hasTargetArrow: boolean;

  private readonly diagonalSource: number;

  private readonly diagonalTarget: number;

  public constructor(params?: DirectEdgeParams | undefined) {
    this.hasSourceArrow = params?.hasSourceArrow === true;
    this.hasTargetArrow = params?.hasTargetArrow === true;

    this.view = new StructuredView({
      color: params?.color ?? edgeConstants.color,
      width: params?.width ?? edgeConstants.width,
      hasSourceArrow: this.hasSourceArrow,
      hasTargetArrow: this.hasTargetArrow,
    });

    [this.afterRenderEmitter, this.onAfterRender] =
      createPair<StructuredEdgeRenderModel>();

    [this.modelChangeEmitter, this.onModelChange] =
      createPair<DirectEdgeShapeModel>();

    this.arrowLength = params?.arrowLength ?? edgeConstants.arrowLength;
    this.arrowRenderer = resolveArrowRenderer(params?.arrowRenderer ?? {});

    this.sourceOffsetFn = resolvePortOffsetFn(
      params?.sourceOffset ?? edgeConstants.portOffset,
    );

    this.targetOffsetFn = resolvePortOffsetFn(
      params?.targetOffset ?? edgeConstants.portOffset,
    );

    this.element = this.view.element;
    this.line = this.view.line;
    this.group = this.view.group;
    this.sourceArrow = this.view.sourceArrow;
    this.targetArrow = this.view.targetArrow;

    this.diagonalSource = this.hasSourceArrow ? this.arrowLength : 0;
    this.diagonalTarget = this.hasTargetArrow ? this.arrowLength : 0;

    this.onModelChange.subscribe((model) => {
      this.updateView(model);
    });
  }

  public render(params: EdgeRenderParams): void {
    this.modelChangeEmitter.emit(this.createModel(params));
  }

  public createModel(params: EdgeRenderParams): DirectEdgeShapeModel {
    const { x, y, width, height, from, to } = createEdgeRectangle(
      params.from,
      params.to,
      svgPadding,
    );

    const diagonal: Point = {
      x: to.x - from.x,
      y: to.y - from.y,
    };

    const diagonalLength = Math.sqrt(
      diagonal.x * diagonal.x + diagonal.y * diagonal.y,
    );

    let linePath = "";
    let sourceArrowPath: string = "";
    let targetArrowPath: string = "";
    let source: Point = from;
    let target: Point = to;
    let lineBegin: Point = from;
    let lineEnd: Point = to;

    if (diagonalLength > 0) {
      const sourceDirection: Point = {
        x: diagonal.x / diagonalLength,
        y: diagonal.y / diagonalLength,
      };

      const targetDirection: Point = {
        x: -sourceDirection.x,
        y: -sourceDirection.y,
      };

      const sourceOffset = this.sourceOffsetFn({
        direction: sourceDirection,
        radius: {
          horizontal: params.from.width / 2,
          vertical: params.from.height / 2,
        },
      });

      const targetOffset = this.targetOffsetFn({
        direction: targetDirection,
        radius: {
          horizontal: params.to.width / 2,
          vertical: params.to.height / 2,
        },
      });

      source = {
        x: from.x + sourceDirection.x * sourceOffset,
        y: from.y + sourceDirection.y * sourceOffset,
      };

      target = {
        x: to.x + targetDirection.x * targetOffset,
        y: to.y + targetDirection.y * targetOffset,
      };

      lineBegin = {
        x: source.x + sourceDirection.x * this.diagonalSource,
        y: source.y + sourceDirection.y * this.diagonalSource,
      };

      lineEnd = {
        x: target.x + targetDirection.x * this.diagonalTarget,
        y: target.y + targetDirection.y * this.diagonalTarget,
      };

      linePath = `M ${lineBegin.x} ${lineBegin.y} L ${lineEnd.x} ${lineEnd.y}`;

      if (this.hasSourceArrow) {
        sourceArrowPath = this.arrowRenderer({
          direction: sourceDirection,
          shift: source,
          arrowLength: this.arrowLength,
        });
      }

      if (this.hasTargetArrow) {
        targetArrowPath = this.arrowRenderer({
          direction: targetDirection,
          shift: target,
          arrowLength: this.arrowLength,
        });
      }
    }

    const model: DirectEdgeShapeModel = {
      box: { x, y, width, height },
      line: {
        path: linePath,
        begin: lineBegin,
        end: lineEnd,
      },
      source: {
        arrowPath: sourceArrowPath,
        coords: source,
      },
      target: {
        arrowPath: targetArrowPath,
        coords: target,
      },
      calculateMidpoint: () => {
        return {
          x: (source.x + target.x) / 2,
          y: (source.y + target.y) / 2,
        };
      },
    };

    return model;
  }

  private updateView(model: DirectEdgeShapeModel): void {
    const { box, line, source, target } = model;

    setSvgRectangle(this.element, box);

    this.view.line.setAttribute("d", line.path);

    if (this.view.sourceArrow !== null) {
      this.view.sourceArrow.setAttribute("d", model.source.arrowPath);
    }

    if (this.view.targetArrow !== null) {
      this.view.targetArrow.setAttribute("d", model.target.arrowPath);
    }

    this.afterRenderEmitter.emit({
      edgePath: {
        path: line.path,
        midpoint: model.calculateMidpoint(),
      },
      sourceArrowPath: source.arrowPath,
      targetArrowPath: target.arrowPath,
    });
  }
}
