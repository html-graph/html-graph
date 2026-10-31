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

  private readonly renderParamsEmitter: EventEmitter<EdgeRenderParams>;

  private readonly onRenderParamsChange: EventHandler<EdgeRenderParams>;

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

    [this.renderParamsEmitter, this.onRenderParamsChange] =
      createPair<EdgeRenderParams>();

    [this.modelChangeEmitter, this.onModelChange] =
      createPair<SegmentedEditableEdgeModel>();

    this.onRenderParamsChange.subscribe((params) => {
      const model = new SegmentedEditableEdgeModel(params, this.shapeParams);

      this.modelChangeEmitter.emit(model);
    });

    this.onModelChange.subscribe((model) => {
      updateStructuredView(this.view, model);
    });
  }

  public render(params: EdgeRenderParams): void {
    this.renderParamsEmitter.emit(params);
  }
}
