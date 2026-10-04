import { EventHandler } from "@/event-subject";
import {
  EdgeRenderParams,
  CycleSquareEdgePath,
  DetourOrthogonalEdgePath,
  OrthogonalEdgePath,
  EdgePathFactory,
  PathEdgeShape,
  PathPort,
  svgPadding,
  StructuredEdgeView,
} from "../../shared";
import { OrthogonalEdgeModel } from "../orthogonal-edge-model";
import { OrthogonalEdgeControllerParams } from "./orthogonal-edge-controller-params";
import { orthogonalizeDirection } from "../orthogonalize-direction";

export class OrthogonalEdgeController {
  public readonly element: SVGSVGElement;

  public readonly view: StructuredEdgeView;

  public readonly onModelChange: EventHandler<OrthogonalEdgeModel>;

  private readonly pathShape: PathEdgeShape;

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

  public constructor(private readonly params: OrthogonalEdgeControllerParams) {
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
