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

  public constructor(params: BezierEdgeControllerParams) {
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
      curvature: params.curvature,
      detourDirection: params.detourDirection,
      detourDistance: params.detourDistance,
      portCycleRadius: params.portCycleRadius,
      portCycleSmallRadius: params.portCycleSmallRadius,
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
