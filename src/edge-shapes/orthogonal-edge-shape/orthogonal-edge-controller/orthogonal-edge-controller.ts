import { createPair, EventEmitter, EventHandler } from "@/event-subject";
import {
  EdgeRenderParams,
  CycleSquareEdgePath,
  DetourOrthogonalEdgePath,
  OrthogonalEdgePath,
  EdgePathFactory,
  PathPort,
  svgPadding,
  StructuredEdgeView,
  updateStructuredView,
  PathEdgeModel,
} from "../../shared";
import { OrthogonalEdgeModel } from "../orthogonal-edge-model";
import { OrthogonalEdgeControllerParams } from "./orthogonal-edge-controller-params";
import { orthogonalizeDirection } from "../orthogonalize-direction";
import { PathEdgeModelShapeParams } from "../../shared";

export class OrthogonalEdgeController {
  public readonly view: StructuredEdgeView;

  public readonly onModelChange: EventHandler<OrthogonalEdgeModel>;

  private readonly modelChangeEmitter: EventEmitter<OrthogonalEdgeModel>;

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
    new DetourOrthogonalEdgePath({
      from,
      to,
      arrowLength: this.params.arrowLength,
      arrowOffset: this.params.arrowOffset,
      roundness: this.params.roundness,
      detourDistance: this.params.detourDistance,
    });

  private readonly createLinePath: EdgePathFactory = (
    from: PathPort,
    to: PathPort,
  ) =>
    new OrthogonalEdgePath({
      from,
      to,
      arrowLength: this.params.arrowLength,
      arrowOffset: this.params.arrowOffset,
      roundness: this.params.roundness,
    });

  private readonly shapeParams: PathEdgeModelShapeParams;

  public constructor(private readonly params: OrthogonalEdgeControllerParams) {
    this.view = new StructuredEdgeView({
      color: params.color,
      width: params.width,
      hasSourceArrow: params.hasSourceArrow,
      hasTargetArrow: params.hasTargetArrow,
    });

    this.shapeParams = {
      createLinePath: this.createLinePath,
      createNodeCyclePath: this.createNodeCyclePath,
      createPortCyclePath: this.createPortCyclePath,
      hasSourceArrow: this.params.hasSourceArrow,
      hasTargetArrow: this.params.hasTargetArrow,
      arrowRenderer: this.params.arrowRenderer,
      arrowLength: this.params.arrowLength,
      padding: svgPadding,
    };

    [this.modelChangeEmitter, this.onModelChange] =
      createPair<OrthogonalEdgeModel>();

    this.onModelChange.subscribe((model) => {
      updateStructuredView(this.view, model);
    });
  }

  public render(params: EdgeRenderParams): void {
    const { category, from, to } = params;

    const model = new PathEdgeModel(
      {
        category,
        from: {
          ...from,
          direction: orthogonalizeDirection(from.direction),
        },
        to: {
          ...to,
          direction: orthogonalizeDirection(to.direction),
        },
      },
      this.shapeParams,
    );

    this.modelChangeEmitter.emit(model);
  }
}
