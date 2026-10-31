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

  private latestRenderParams: EdgeRenderParams | null = null;

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

    this.onModelChange.subscribe((model) => {
      updateStructuredView(this.view, model);
    });

    this.onRenderParamsChange.subscribe((params) => {
      this.latestRenderParams = params;

      this.emitModelChange();
    });

    this.waypoints.onChange.subscribe(() => {
      this.emitModelChange();
    });
  }

  public render(params: EdgeRenderParams): void {
    this.renderParamsEmitter.emit(params);
  }

  private emitModelChange(): void {
    if (this.latestRenderParams === null) {
      return;
    }

    const model = new SegmentedEditableEdgeModel(
      this.latestRenderParams,
      this.shapeParams,
      this.waypoints.getValue(),
    );

    this.modelChangeEmitter.emit(model);
  }
}
