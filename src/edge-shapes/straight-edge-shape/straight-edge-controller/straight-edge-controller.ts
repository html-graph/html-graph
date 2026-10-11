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

  public constructor(private readonly params: StraightEdgeControllerParams) {
    this.view = new StructuredEdgeView({
      color: this.params.color,
      width: this.params.width,
      hasSourceArrow: this.params.hasSourceArrow,
      hasTargetArrow: this.params.hasTargetArrow,
    });

    this.shapeParams = {
      hasSourceArrow: this.params.hasSourceArrow,
      hasTargetArrow: this.params.hasTargetArrow,
      arrowRenderer: this.params.arrowRenderer,
      arrowLength: this.params.arrowLength,
      arrowOffset: this.params.arrowOffset,
      roundness: this.params.roundness,
      cycleSquareSide: this.params.cycleSquareSide,
      detourDirection: this.params.detourDirection,
      detourDistance: this.params.detourDistance,
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
