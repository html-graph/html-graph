import {
  EdgeRenderParams,
  StructuredEdgeView,
  updateStructuredView,
} from "../../shared";
import { createPair, EventEmitter, EventHandler } from "@/event-subject";
import { DirectEdgeControllerParams } from "./direct-edge-controller-params";
import {
  DirectEdgeModel,
  DirectEdgeModelShapeParams,
} from "../direct-edge-model";

export class DirectEdgeController {
  public readonly view: StructuredEdgeView;

  public readonly onModelChange: EventHandler<DirectEdgeModel>;

  private readonly modelChangeEmitter: EventEmitter<DirectEdgeModel>;

  private readonly shapeParams: DirectEdgeModelShapeParams;

  public constructor(private readonly params: DirectEdgeControllerParams) {
    this.view = new StructuredEdgeView({
      color: this.params.color,
      width: this.params.width,
      hasSourceArrow: this.params.hasSourceArrow,
      hasTargetArrow: this.params.hasTargetArrow,
    });

    this.shapeParams = {
      sourceOffsetFn: this.params.sourceOffsetFn,
      targetOffsetFn: this.params.targetOffsetFn,
      hasSourceArrow: this.params.hasSourceArrow,
      hasTargetArrow: this.params.hasTargetArrow,
      arrowRenderer: this.params.arrowRenderer,
      arrowLength: this.params.arrowLength,
    };

    [this.modelChangeEmitter, this.onModelChange] =
      createPair<DirectEdgeModel>();

    this.onModelChange.subscribe((model) => {
      updateStructuredView(this.view, model);
    });
  }

  public render(params: EdgeRenderParams): void {
    const model = new DirectEdgeModel(params, this.shapeParams);

    this.modelChangeEmitter.emit(model);
  }
}
