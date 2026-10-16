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

  public constructor(params: DirectEdgeControllerParams) {
    this.view = new StructuredEdgeView({
      color: params.color,
      width: params.width,
      hasSourceArrow: params.hasSourceArrow,
      hasTargetArrow: params.hasTargetArrow,
    });

    this.shapeParams = {
      sourceOffsetFn: params.sourceOffsetFn,
      targetOffsetFn: params.targetOffsetFn,
      hasSourceArrow: params.hasSourceArrow,
      hasTargetArrow: params.hasTargetArrow,
      arrowRenderer: params.arrowRenderer,
      arrowLength: params.arrowLength,
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
