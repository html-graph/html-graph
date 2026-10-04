import { EventHandler } from "@/event-subject";
import {
  EdgeRenderParams,
  BezierEdgePath,
  DetourBezierEdgePath,
  CycleCircleEdgePath,
  EdgePathFactory,
  PathEdgeShape,
  svgPadding,
  PathPort,
  StructuredEdgeView,
} from "../../shared";
import { BezierEdgeModel } from "../bezier-edge-model";
import { BezierEdgeControllerParams } from "./bezier-edge-controller-params";

export class BezierEdgeController {
  public readonly element: SVGSVGElement;

  public readonly view: StructuredEdgeView;

  public readonly onModelChange: EventHandler<BezierEdgeModel>;

  private readonly pathShape: PathEdgeShape;

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

  public constructor(private readonly params: BezierEdgeControllerParams) {
    this.pathShape = new PathEdgeShape({
      color: this.params.color,
      width: this.params.width,
      arrowRenderer: this.params.arrowRenderer,
      arrowLength: this.params.arrowLength,
      hasSourceArrow: this.params.hasSourceArrow,
      hasTargetArrow: this.params.hasTargetArrow,
      createPortCyclePath: this.createPortCyclePath,
      createNodeCyclePath: this.createNodeCyclePath,
      createLinePath: this.createLinePath,
      padding: svgPadding,
    });

    this.element = this.pathShape.element;
    this.view = this.pathShape.view;
    this.onModelChange = this.pathShape.onModelChange;
  }

  public render(params: EdgeRenderParams): void {
    this.pathShape.render(params);
  }
}
