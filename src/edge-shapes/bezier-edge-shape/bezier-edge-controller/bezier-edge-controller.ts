import { createPair, EventEmitter, EventHandler } from "@/event-subject";
import {
  EdgeRenderParams,
  BezierEdgePath,
  DetourBezierEdgePath,
  CycleCircleEdgePath,
  EdgePathFactory,
  PathPort,
  StructuredEdgeView,
  updateStructuredView,
  PathEdgeModel,
  svgPadding,
} from "../../shared";
import { BezierEdgeModel } from "../bezier-edge-model";
import { BezierEdgeControllerParams } from "./bezier-edge-controller-params";
import { PathEdgeModelShapeParams } from "@/edge-shapes/shared/path-edge-model";

export class BezierEdgeController {
  public readonly view: StructuredEdgeView;

  public readonly onModelChange: EventHandler<BezierEdgeModel>;

  private readonly modelChangeEmitter: EventEmitter<BezierEdgeModel>;

  private readonly createPortCyclePath: EdgePathFactory = (
    from: PathPort,
    to: PathPort,
  ) =>
    new CycleCircleEdgePath({
      from,
      to,
      arrowLength: this.params.arrowLength,
      radius: this.params.portCycleRadius,
      smallRadius: this.params.portCycleSmallRadius,
    });

  private readonly createNodeCyclePath: EdgePathFactory = (
    from: PathPort,
    to: PathPort,
  ) =>
    new DetourBezierEdgePath({
      from,
      to,
      arrowLength: this.params.arrowLength,
      curvature: this.params.curvature,
      detourDir: this.params.detourDirection,
      detourDistance: this.params.detourDistance,
    });

  private readonly createLinePath: EdgePathFactory = (
    from: PathPort,
    to: PathPort,
  ) =>
    new BezierEdgePath({
      from,
      to,
      arrowLength: this.params.arrowLength,
      curvature: this.params.curvature,
    });

  private readonly shapeParams: PathEdgeModelShapeParams;

  public constructor(private readonly params: BezierEdgeControllerParams) {
    this.view = new StructuredEdgeView({
      color: this.params.color,
      width: this.params.width,
      hasSourceArrow: this.params.hasSourceArrow,
      hasTargetArrow: this.params.hasTargetArrow,
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
      createPair<BezierEdgeModel>();

    this.onModelChange.subscribe((model) => {
      updateStructuredView(this.view, model);
    });
  }

  public render(params: EdgeRenderParams): void {
    const model = new PathEdgeModel(params, this.shapeParams);

    this.modelChangeEmitter.emit(model);
  }
}
