import {
  EdgeRenderParams,
  StructuredEdgeShape,
  edgeConstants,
  ArrowRenderer,
  resolveArrowRenderer,
  StructuredEdgeRenderModel,
  StructuredView,
  StructuredEdgeShapeModel,
  updateStructuredView,
} from "../shared";
import { DirectEdgeParams } from "./direct-edge-params";
import { createPair, EventEmitter, EventHandler } from "@/event-subject";
import { PortOffsetFn, resolvePortOffsetFn } from "./resolve-port-offset-fn";
import { DirectEdgeShapeModel } from "./direct-edge-shape-model/direct-edge-shape-model";

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

  /**
   * @deprecated
   */
  private readonly afterRenderEmitter: EventEmitter<StructuredEdgeRenderModel>;

  public readonly onModelChange: EventHandler<StructuredEdgeShapeModel>;

  private readonly modelChangeEmitter: EventEmitter<StructuredEdgeShapeModel>;

  private readonly arrowRenderer: ArrowRenderer;

  private readonly hasSourceArrow: boolean;

  private readonly hasTargetArrow: boolean;

  private readonly diagonalBegin: number;

  private readonly diagonalEnd: number;

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
      createPair<StructuredEdgeShapeModel>();

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

    this.diagonalBegin = this.hasSourceArrow ? this.arrowLength : 0;
    this.diagonalEnd = this.hasTargetArrow ? this.arrowLength : 0;

    this.onModelChange.subscribe((model) => {
      updateStructuredView(this.view, model);

      this.afterRenderEmitter.emit({
        edgePath: {
          path: model.linePath,
          midpoint: model.calculateMidpoint(),
        },
        sourceArrowPath: model.sourceArrowPath,
        targetArrowPath: model.targetArrowPath,
      });
    });
  }

  public render(params: EdgeRenderParams): void {
    const model = new DirectEdgeShapeModel(params, {
      sourceOffsetFn: this.sourceOffsetFn,
      targetOffsetFn: this.targetOffsetFn,
      diagonalBegin: this.diagonalBegin,
      diagonalEnd: this.diagonalEnd,
      hasSourceArrow: this.hasSourceArrow,
      hasTargetArrow: this.hasTargetArrow,
      arrowRenderer: this.arrowRenderer,
      arrowLength: this.arrowLength,
    });

    this.modelChangeEmitter.emit(model);
  }
}
