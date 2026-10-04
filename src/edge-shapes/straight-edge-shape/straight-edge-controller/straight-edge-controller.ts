import {
  EdgeRenderParams,
  CycleSquareEdgePath,
  DetourStraightEdgePath,
  StraightEdgePath,
  EdgePathFactory,
  PathPort,
  svgPadding,
  StructuredEdgeView,
  PathEdgeModel,
  updateStructuredView,
} from "../../shared";
import { StraightEdgeModel } from "../straight-edge-model";
import { StraightEdgeControllerParams } from "./straight-edge-controller-params";
import { createPair, EventEmitter, EventHandler } from "@/event-subject";

export class StraightEdgeController {
  public readonly view: StructuredEdgeView;

  public readonly onModelChange: EventHandler<StraightEdgeModel>;

  private readonly modelChangeEmitter: EventEmitter<StraightEdgeModel>;

  private readonly createPortCyclePath: EdgePathFactory = (
    from: PathPort,
    to: PathPort,
  ) =>
    new CycleSquareEdgePath({
      from,
      to,
      arrowLength: this.params.arrowLength,
      arrowOffset: this.params.arrowOffset,
      roundness: this.params.roundness,
      side: this.params.cycleSquareSide,
    });

  private readonly createNodeCyclePath: EdgePathFactory = (
    from: PathPort,
    to: PathPort,
  ) =>
    new DetourStraightEdgePath({
      from,
      to,
      arrowLength: this.params.arrowLength,
      arrowOffset: this.params.arrowOffset,
      roundness: this.params.roundness,
      detourDir: this.params.detourDirection,
      detourDistance: this.params.detourDistance,
    });

  private readonly createLinePath: EdgePathFactory = (
    from: PathPort,
    to: PathPort,
  ) =>
    new StraightEdgePath({
      from,
      to,
      arrowLength: this.params.arrowLength,
      arrowOffset: this.params.arrowOffset,
      roundness: this.params.roundness,
    });

  public constructor(private readonly params: StraightEdgeControllerParams) {
    this.view = new StructuredEdgeView({
      color: params.color,
      width: params.width,
      hasSourceArrow: params.hasSourceArrow,
      hasTargetArrow: params.hasTargetArrow,
    });

    [this.modelChangeEmitter, this.onModelChange] = createPair<PathEdgeModel>();

    this.onModelChange.subscribe((model) => {
      updateStructuredView(this.view, model);
    });
  }

  public render(params: EdgeRenderParams): void {
    const model = new PathEdgeModel(params, {
      createLinePath: this.createLinePath,
      createNodeCyclePath: this.createNodeCyclePath,
      createPortCyclePath: this.createPortCyclePath,
      hasSourceArrow: this.params.hasSourceArrow,
      hasTargetArrow: this.params.hasTargetArrow,
      arrowRenderer: this.params.arrowRenderer,
      arrowLength: this.params.arrowLength,
      padding: svgPadding,
    });

    this.modelChangeEmitter.emit(model);
  }
}
