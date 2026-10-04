import {
  EdgeRenderParams,
  CycleSquareEdgePath,
  DetourStraightEdgePath,
  StraightEdgePath,
  edgeConstants,
  EdgePathFactory,
  PathEdgeShape,
  PathPort,
  svgPadding,
  StructuredEdgeView,
} from "../../shared";
import { EventHandler } from "@/event-subject";
import { StraightEdgeModel } from "../straight-edge-model";
import { StraightEdgeControllerParams } from "./straight-edge-controller-params";

export class StraightEdgeController {
  public readonly element: SVGSVGElement;

  public readonly view: StructuredEdgeView;

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

  public constructor(private readonly params: StraightEdgeControllerParams) {
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
      color: this.params.color,
      width: this.params.width,
      arrowRenderer: params.arrowRenderer,
      arrowLength: this.arrowLength,
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
