import { EventHandler } from "@/event-subject";
import {
  EdgeRenderParams,
  BezierEdgePath,
  DetourBezierEdgePath,
  CycleCircleEdgePath,
  edgeConstants,
  EdgePathFactory,
  PathEdgeShape,
  StructuredEdgeShape,
  resolveArrowRenderer,
  svgPadding,
  PathPort,
  StructuredEdgeView,
  configureMidpoint,
  configureInteractiveEdge,
} from "../shared";
import { BezierEdgeParams } from "./bezier-edge-params";
import { BezierEdgeModel } from "./bezier-edge-model";

export class BezierEdgeShape implements StructuredEdgeShape {
  public readonly element: SVGSVGElement;

  public readonly view: StructuredEdgeView;

  public readonly onModelChange: EventHandler<BezierEdgeModel>;

  private readonly arrowLength: number;

  private readonly curvature: number;

  private readonly portCycleRadius: number;

  private readonly portCycleSmallRadius: number;

  private readonly detourDirection: number;

  private readonly detourDistance: number;

  private readonly pathShape: PathEdgeShape;

  private readonly createPortCyclePath: EdgePathFactory = (
    from: PathPort,
    to: PathPort,
  ) =>
    new CycleCircleEdgePath({
      from,
      to,
      arrowLength: this.arrowLength,
      radius: this.portCycleRadius,
      smallRadius: this.portCycleSmallRadius,
    });

  private readonly createNodeCyclePath: EdgePathFactory = (
    from: PathPort,
    to: PathPort,
  ) =>
    new DetourBezierEdgePath({
      from,
      to,
      arrowLength: this.arrowLength,
      curvature: this.curvature,
      detourDir: this.detourDirection,
      detourDistance: this.detourDistance,
    });

  private readonly createLinePath: EdgePathFactory = (
    from: PathPort,
    to: PathPort,
  ) =>
    new BezierEdgePath({
      from,
      to,
      arrowLength: this.arrowLength,
      curvature: this.curvature,
    });

  public constructor(params?: BezierEdgeParams | undefined) {
    this.arrowLength = params?.arrowLength ?? edgeConstants.arrowLength;
    this.curvature = params?.curvature ?? edgeConstants.curvature;
    this.portCycleRadius = params?.cycleRadius ?? edgeConstants.cycleRadius;
    this.portCycleSmallRadius =
      params?.smallCycleRadius ?? edgeConstants.smallCycleRadius;
    this.detourDirection =
      params?.detourDirection ?? edgeConstants.detourDirection;
    this.detourDistance =
      params?.detourDistance ?? edgeConstants.detourDistance;

    this.pathShape = new PathEdgeShape({
      color: params?.color ?? edgeConstants.color,
      width: params?.width ?? edgeConstants.width,
      arrowRenderer: resolveArrowRenderer(params?.arrowRenderer ?? {}),
      arrowLength: this.arrowLength,
      hasSourceArrow: params?.hasSourceArrow ?? edgeConstants.hasSourceArrow,
      hasTargetArrow: params?.hasTargetArrow ?? edgeConstants.hasTargetArrow,
      createPortCyclePath: this.createPortCyclePath,
      createNodeCyclePath: this.createNodeCyclePath,
      createLinePath: this.createLinePath,
      padding: svgPadding,
    });

    this.element = this.pathShape.element;
    this.view = this.pathShape.view;
    this.onModelChange = this.pathShape.onModelChange;

    if (params?.midpointElement !== undefined) {
      configureMidpoint(this, params.midpointElement);
    }

    if (
      params?.interactiveDistance !== undefined &&
      params.interactiveDistance > 0
    ) {
      configureInteractiveEdge(this, params.interactiveDistance);
    }
  }

  public render(params: EdgeRenderParams): void {
    this.pathShape.render(params);
  }
}
