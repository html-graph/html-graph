import {
  EdgeRenderParams,
  StructuredEdgeShape,
  edgeConstants,
  ArrowRenderer,
  resolveArrowRenderer,
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

  public readonly view: StructuredEdgeView;

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

    this.onModelChange.subscribe((model) => {
      updateStructuredView(this.view, model);
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
