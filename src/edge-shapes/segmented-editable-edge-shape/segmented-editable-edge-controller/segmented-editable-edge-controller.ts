import { createPair, EventEmitter, EventHandler } from "@/event-subject";
import {
  EdgeRenderParams,
  StructuredEdgeView,
  updateStructuredView,
} from "../../shared";
import {
  SegmentedEditableEdgeModel,
  SegmentedEditableEdgeModelShapeParams,
} from "../segmented-editable-edge-model";
import { SegmentedEditableEdgeControllerParams } from "./segmented-editable-edge-controller-params";
import { Waypoints } from "./waypoints";

export class SegmentedEditableEdgeController {
  public readonly view: StructuredEdgeView;

  public readonly onModelChange: EventHandler<SegmentedEditableEdgeModel>;

  public readonly waypoints = new Waypoints();

  private readonly modelChangeEmitter: EventEmitter<SegmentedEditableEdgeModel>;

  private readonly shapeParams: SegmentedEditableEdgeModelShapeParams;

  public constructor(params: SegmentedEditableEdgeControllerParams) {
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
      createPair<SegmentedEditableEdgeModel>();

    this.onModelChange.subscribe((model) => {
      updateStructuredView(this.view, model);
    });
  }

  public render(params: EdgeRenderParams): void {
    const model = new SegmentedEditableEdgeModel(params, this.shapeParams);

    this.modelChangeEmitter.emit(model);
  }
}
