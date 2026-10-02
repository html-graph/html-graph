import {
  EdgeRenderParams,
  CycleSquareEdgePath,
  DetourStraightEdgePath,
  StraightEdgePath,
  edgeConstants,
  EdgePathFactory,
  PathEdgeShape,
  PathPort,
  StructuredEdgeShape,
  StructuredEdgeRenderModel,
  resolveArrowRenderer,
  svgPadding,
  StructuredEdgeView,
  configureMidpoint,
  configureInteractiveEdge,
} from "../shared";
import { StraightEdgeModel } from "./straight-edge-model";
import { StraightEdgeParams } from "./straight-edge-params";
import { EventHandler } from "@/event-subject";

export class StraightEdgeShape implements StructuredEdgeShape {
  public readonly element: SVGSVGElement;

  /**
   * @deprecated
   * use view.group instead
   */
  public readonly group: SVGGElement;

  /**
   * @deprecated
   * use view.line instead
   */
  public readonly line: SVGPathElement;

  /**
   * @deprecated
   * use view.line instead
   */
  public readonly sourceArrow: SVGPathElement | null;

  /**
   * @deprecated
   * use view.targetArrow instead
   */
  public readonly targetArrow: SVGPathElement | null;

  public readonly view: StructuredEdgeView;

  /**
   * @deprecated
   * use onModelChange instead
   */
  public readonly onAfterRender: EventHandler<StructuredEdgeRenderModel>;

  public readonly onModelChange: EventHandler<StraightEdgeModel>;

  private readonly arrowLength: number;

  private readonly arrowOffset: number;

  private readonly roundness: number;

  private readonly cycleSquareSide: number;

  private readonly detourDirection: number;

  private readonly detourDistance: number;

  private readonly pathShape: PathEdgeShape;

  private readonly createPortCyclePath: EdgePathFactory = (
    from: PathPort,
    to: PathPort,
  ) =>
    new CycleSquareEdgePath({
      from,
      to,
      arrowLength: this.arrowLength,
      arrowOffset: this.arrowOffset,
      roundness: this.roundness,
      side: this.cycleSquareSide,
    });

  private readonly createNodeCyclePath: EdgePathFactory = (
    from: PathPort,
    to: PathPort,
  ) =>
    new DetourStraightEdgePath({
      from,
      to,
      arrowLength: this.arrowLength,
      arrowOffset: this.arrowOffset,
      roundness: this.roundness,
      detourDir: this.detourDirection,
      detourDistance: this.detourDistance,
    });

  private readonly createLinePath: EdgePathFactory = (
    from: PathPort,
    to: PathPort,
  ) =>
    new StraightEdgePath({
      from,
      to,
      arrowLength: this.arrowLength,
      arrowOffset: this.arrowOffset,
      roundness: this.roundness,
    });

  public constructor(params?: StraightEdgeParams | undefined) {
    this.arrowLength = params?.arrowLength ?? edgeConstants.arrowLength;
    this.arrowOffset = params?.arrowOffset ?? edgeConstants.arrowOffset;
    this.cycleSquareSide =
      params?.cycleSquareSide ?? edgeConstants.cycleSquareSide;

    const roundness = params?.roundness ?? edgeConstants.roundness;

    this.roundness = Math.min(
      roundness,
      this.arrowOffset,
      this.cycleSquareSide / 2,
    );

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
    this.group = this.view.group;
    this.line = this.view.line;
    this.sourceArrow = this.view.sourceArrow;
    this.targetArrow = this.view.targetArrow;
    this.onModelChange = this.pathShape.onModelChange;
    this.onAfterRender = this.pathShape.onAfterRender;

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
