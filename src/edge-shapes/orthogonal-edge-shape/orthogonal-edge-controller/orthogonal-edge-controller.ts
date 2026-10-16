import { createPair, EventEmitter, EventHandler } from "@/event-subject";
import {
  EdgeRenderParams,
  StructuredEdgeView,
  updateStructuredView,
} from "../../shared";
import {
  OrthogonalEdgeModel,
  OrthogonalEdgeModelShapeParams,
} from "../orthogonal-edge-model";
import { OrthogonalEdgeControllerParams } from "./orthogonal-edge-controller-params";

export class OrthogonalEdgeController {
  public readonly view: StructuredEdgeView;

  public readonly onModelChange: EventHandler<OrthogonalEdgeModel>;

  private readonly modelChangeEmitter: EventEmitter<OrthogonalEdgeModel>;

  private readonly shapeParams: OrthogonalEdgeModelShapeParams;

  public constructor(params: OrthogonalEdgeControllerParams) {
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
      detourDistance: params.detourDistance,
    };

    [this.modelChangeEmitter, this.onModelChange] =
      createPair<OrthogonalEdgeModel>();

    this.onModelChange.subscribe((model) => {
      updateStructuredView(this.view, model);
    });
  }

  public render(params: EdgeRenderParams): void {
    const model = new OrthogonalEdgeModel(params, this.shapeParams);

    this.modelChangeEmitter.emit(model);
  }
}
