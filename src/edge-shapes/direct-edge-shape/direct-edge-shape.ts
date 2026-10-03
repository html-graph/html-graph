import {
  EdgeRenderParams,
  StructuredEdgeShape,
  edgeConstants,
  ArrowRenderer,
  resolveArrowRenderer,
  StructuredEdgeRenderModel,
  StructuredEdgeView,
  updateStructuredView,
  configureMidpoint,
  configureInteractiveEdge,
} from "../shared";
import { DirectEdgeParams } from "./direct-edge-params";
import { createPair, EventEmitter, EventHandler } from "@/event-subject";
import { PortOffsetFn, resolvePortOffsetFn } from "./resolve-port-offset-fn";
import { DirectEdgeModel } from "./direct-edge-model";

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

  public readonly view: StructuredEdgeView;

  /**
   * @deprecated
   * use onModelChange instead
   */
  public readonly onAfterRender: EventHandler<StructuredEdgeRenderModel>;

  /**
   * @deprecated
   */
  private readonly afterRenderEmitter: EventEmitter<StructuredEdgeRenderModel>;

  public readonly onModelChange: EventHandler<DirectEdgeModel>;

  private readonly modelChangeEmitter: EventEmitter<DirectEdgeModel>;

  private readonly arrowRenderer: ArrowRenderer;

  private readonly hasSourceArrow: boolean;

  private readonly hasTargetArrow: boolean;

  private readonly arrowLength: number;

  private readonly sourceOffsetFn: PortOffsetFn;

  private readonly targetOffsetFn: PortOffsetFn;

  public constructor(params?: DirectEdgeParams | undefined) {
    this.hasSourceArrow = params?.hasSourceArrow === true;
    this.hasTargetArrow = params?.hasTargetArrow === true;

    this.view = new StructuredEdgeView({
      color: params?.color ?? edgeConstants.color,
      width: params?.width ?? edgeConstants.width,
      hasSourceArrow: this.hasSourceArrow,
      hasTargetArrow: this.hasTargetArrow,
    });

    [this.afterRenderEmitter, this.onAfterRender] =
      createPair<StructuredEdgeRenderModel>();

    [this.modelChangeEmitter, this.onModelChange] =
      createPair<DirectEdgeModel>();

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

    if (params?.midpointElement !== undefined) {
      configureMidpoint(this, params.midpointElement);
    }

    if (
      params?.interactiveDistance !== undefined &&
      params.interactiveDistance > 0
    ) {
      configureInteractiveEdge(this, params.interactiveDistance);
    }
  }

  public render(params: EdgeRenderParams): void {
    const model = new DirectEdgeModel(params, {
      sourceOffsetFn: this.sourceOffsetFn,
      targetOffsetFn: this.targetOffsetFn,
      hasSourceArrow: this.hasSourceArrow,
      hasTargetArrow: this.hasTargetArrow,
      arrowRenderer: this.arrowRenderer,
      arrowLength: this.arrowLength,
    });

    this.modelChangeEmitter.emit(model);
  }
}
