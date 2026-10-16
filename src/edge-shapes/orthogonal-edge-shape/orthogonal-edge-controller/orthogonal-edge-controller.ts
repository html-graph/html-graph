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

  public constructor(private readonly params: OrthogonalEdgeControllerParams) {
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
      detourDistance: this.params.detourDistance,
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
