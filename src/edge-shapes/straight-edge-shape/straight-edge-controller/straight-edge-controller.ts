import {
  EdgeRenderParams,
  StructuredEdgeView,
  updateStructuredView,
} from "../../shared";
import {
  StraightEdgeModel,
  StraightEdgeModelShapeParams,
} from "../straight-edge-model";
import { StraightEdgeControllerParams } from "./straight-edge-controller-params";
import { createPair, EventEmitter, EventHandler } from "@/event-subject";

export class StraightEdgeController {
  public readonly view: StructuredEdgeView;

  public readonly onModelChange: EventHandler<StraightEdgeModel>;

  private readonly modelChangeEmitter: EventEmitter<StraightEdgeModel>;

  private readonly shapeParams: StraightEdgeModelShapeParams;

  public constructor(params: StraightEdgeControllerParams) {
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
      cycleSquareSide: params.cycleSquareSide,
      detourDirection: params.detourDirection,
      detourDistance: params.detourDistance,
    };

    [this.modelChangeEmitter, this.onModelChange] =
      createPair<StraightEdgeModel>();

    this.onModelChange.subscribe((model) => {
      updateStructuredView(this.view, model);
    });
  }

  public render(params: EdgeRenderParams): void {
    const model = new StraightEdgeModel(params, this.shapeParams);

    this.modelChangeEmitter.emit(model);
  }
}
