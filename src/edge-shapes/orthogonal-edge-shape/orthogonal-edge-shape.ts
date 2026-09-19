import {
  EdgeRenderParams,
  CycleSquareEdgePath,
  DetourOrthogonalEdgePath,
  OrthogonalEdgePath,
  edgeConstants,
  EdgePathFactory,
  PathEdgeShape,
  PathPort,
  StructuredEdgeShape,
  StructuredEdgeRenderModel,
  resolveArrowRenderer,
  svgPadding,
} from "../shared";
import { OrthogonalEdgeParams } from "./orthogonal-edge-params";
import { EventHandler } from "@/event-subject";
import { orthogonalizeDirection } from "./orthogonalize-direction";

export class OrthogonalEdgeShape implements StructuredEdgeShape {
  public readonly element: SVGSVGElement;

  public readonly group: SVGGElement;

  public readonly line: SVGPathElement;

  public readonly sourceArrow: SVGPathElement | null;

  public readonly targetArrow: SVGPathElement | null;

  public readonly onAfterRender: EventHandler<StructuredEdgeRenderModel>;

  private readonly arrowLength: number;

  private readonly arrowOffset: number;

  private readonly roundness: number;

  private readonly cycleSquareSide: number;

  private readonly detourDistance: number;

  private readonly hasSourceArrow: boolean;

  private readonly hasTargetArrow: boolean;

  private readonly pathShape: PathEdgeShape;

  private readonly createPortCyclePath: EdgePathFactory = (
    from: PathPort,
    to: PathPort,
  ) =>
    new CycleSquareEdgePath({
      from,
      to,
      arrowLength: this.arrowLength,
      side: this.cycleSquareSide,
      arrowOffset: this.arrowOffset,
      roundness: this.roundness,
    });

  private readonly createNodeCyclePath: EdgePathFactory = (
    from: PathPort,
    to: PathPort,
  ) =>
    new DetourOrthogonalEdgePath({
      from,
      to,
      arrowLength: this.arrowLength,
      arrowOffset: this.arrowOffset,
      roundness: this.roundness,
      detourDistance: this.detourDistance,
    });

  private readonly createLinePath: EdgePathFactory = (
    from: PathPort,
    to: PathPort,
  ) =>
    new OrthogonalEdgePath({
      from,
      to,
      arrowLength: this.arrowLength,
      arrowOffset: this.arrowOffset,
      roundness: this.roundness,
    });

  public constructor(params?: OrthogonalEdgeParams | undefined) {
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

    this.detourDistance =
      params?.detourDistance ?? edgeConstants.detourDistance;
    this.hasSourceArrow =
      params?.hasSourceArrow ?? edgeConstants.hasSourceArrow;
    this.hasTargetArrow =
      params?.hasTargetArrow ?? edgeConstants.hasTargetArrow;

    this.pathShape = new PathEdgeShape({
      color: params?.color ?? edgeConstants.color,
      width: params?.width ?? edgeConstants.width,
      arrowRenderer: resolveArrowRenderer(params?.arrowRenderer ?? {}),
      arrowLength: this.arrowLength,
      hasSourceArrow: this.hasSourceArrow,
      hasTargetArrow: this.hasTargetArrow,
      createPortCyclePath: this.createPortCyclePath,
      createNodeCyclePath: this.createNodeCyclePath,
      createLinePath: this.createLinePath,
      padding: svgPadding,
    });

    this.element = this.pathShape.element;
    this.group = this.pathShape.group;
    this.line = this.pathShape.line;
    this.sourceArrow = this.pathShape.sourceArrow;
    this.targetArrow = this.pathShape.targetArrow;
    this.onAfterRender = this.pathShape.onAfterRender;
  }

  public render(params: EdgeRenderParams): void {
    const { from, to, category } = params;

    this.pathShape.render({
      category,
      from: {
        ...from,
        direction: orthogonalizeDirection(from.direction),
      },
      to: {
        ...to,
        direction: orthogonalizeDirection(to.direction),
      },
    });
  }
}
