import { createPair, EventEmitter, EventHandler } from "@/event-subject";
import {
  EdgeRenderParams,
  StructuredEdgeView,
  updateStructuredView,
} from "../../shared";
import { BezierEdgeControllerParams } from "./bezier-edge-controller-params";
import {
  BezierEdgeModel,
  BezierEdgeModelShapeParams,
} from "../bezier-edge-model";

export class BezierEdgeController {
  public readonly view: StructuredEdgeView;

  public readonly onModelChange: EventHandler<BezierEdgeModel>;

  private readonly modelChangeEmitter: EventEmitter<BezierEdgeModel>;

  private readonly shapeParams: BezierEdgeModelShapeParams;

  public constructor(private readonly params: BezierEdgeControllerParams) {
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
      curvature: this.params.curvature,
      detourDirection: this.params.detourDirection,
      detourDistance: this.params.detourDistance,
      portCycleRadius: this.params.portCycleRadius,
      portCycleSmallRadius: this.params.portCycleSmallRadius,
    };

    [this.modelChangeEmitter, this.onModelChange] =
      createPair<BezierEdgeModel>();

    this.onModelChange.subscribe((model) => {
      updateStructuredView(this.view, model);
    });
  }

  public render(params: EdgeRenderParams): void {
    const model = new BezierEdgeModel(params, this.shapeParams);

    this.modelChangeEmitter.emit(model);
  }
}
