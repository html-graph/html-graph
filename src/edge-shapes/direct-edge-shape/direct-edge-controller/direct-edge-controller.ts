import {
  EdgeRenderParams,
  StructuredEdgeView,
  updateStructuredView,
} from "../../shared";
import { createPair, EventEmitter, EventHandler } from "@/event-subject";
import { DirectEdgeControllerParams } from "./direct-edge-controller-params";
import { DirectEdgeModel } from "../direct-edge-model";

export class DirectEdgeController {
  public readonly element: SVGSVGElement;

  public readonly view: StructuredEdgeView;

  public readonly onModelChange: EventHandler<DirectEdgeModel>;

  private readonly modelChangeEmitter: EventEmitter<DirectEdgeModel>;

  public constructor(private readonly params: DirectEdgeControllerParams) {
    this.view = new StructuredEdgeView({
      color: this.params.color,
      width: this.params.width,
      hasSourceArrow: this.params.hasSourceArrow,
      hasTargetArrow: this.params.hasTargetArrow,
    });

    [this.modelChangeEmitter, this.onModelChange] =
      createPair<DirectEdgeModel>();

    this.element = this.view.element;

    this.onModelChange.subscribe((model) => {
      updateStructuredView(this.view, model);
    });
  }

  public render(params: EdgeRenderParams): void {
    const model = new DirectEdgeModel(params, {
      sourceOffsetFn: this.params.sourceOffsetFn,
      targetOffsetFn: this.params.targetOffsetFn,
      hasSourceArrow: this.params.hasSourceArrow,
      hasTargetArrow: this.params.hasTargetArrow,
      arrowRenderer: this.params.arrowRenderer,
      arrowLength: this.params.arrowLength,
    });

    this.modelChangeEmitter.emit(model);
  }
}
