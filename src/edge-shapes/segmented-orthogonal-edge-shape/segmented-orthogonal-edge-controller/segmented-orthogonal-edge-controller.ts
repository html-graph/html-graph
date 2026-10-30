import { createPair, EventEmitter, EventHandler } from "@/event-subject";
import {
  EdgeRenderParams,
  StructuredEdgeView,
  updateStructuredView,
} from "../../shared";
import {
  SegmentedOrthogonalEdgeModel,
  SegmentedOrthogonalEdgeModelShapeParams,
} from "../segmented-orthogonal-edge-model";
import { SegmentedOrthogonalEdgeControllerParams } from "./segmented-orthogonal-edge-controller-params";

export class SegmentedOrthogonalEdgeController {
  public readonly view: StructuredEdgeView;

  public readonly onModelChange: EventHandler<SegmentedOrthogonalEdgeModel>;

  private readonly modelChangeEmitter: EventEmitter<SegmentedOrthogonalEdgeModel>;

  private readonly shapeParams: SegmentedOrthogonalEdgeModelShapeParams;

  public constructor(params: SegmentedOrthogonalEdgeControllerParams) {
    this.view = new StructuredEdgeView({
      color: params.color,
      width: params.width,
      hasSourceArrow: params.hasSourceArrow,
      hasTargetArrow: params.hasTargetArrow,
    });

    this.shapeParams = {
      hasSourceArrow: params.hasSourceArrow,
      hasTargetArrow: params.hasTargetArrow,
      arrowRenderer: params.arrowRenderer,
      arrowLength: params.arrowLength,
      arrowOffset: params.arrowOffset,
      roundness: params.roundness,
    };

    [this.modelChangeEmitter, this.onModelChange] =
      createPair<SegmentedOrthogonalEdgeModel>();

    this.onModelChange.subscribe((model) => {
      updateStructuredView(this.view, model);
    });
  }

  public render(params: EdgeRenderParams): void {
    const model = new SegmentedOrthogonalEdgeModel(params, this.shapeParams);

    this.modelChangeEmitter.emit(model);
  }
}
