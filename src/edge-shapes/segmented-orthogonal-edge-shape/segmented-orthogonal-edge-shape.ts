import {
  EdgeRenderParams,
  edgeConstants,
  StructuredEdgeShape,
  resolveArrowRenderer,
  StructuredEdgeView,
  configureMidpoint,
  configureInteractiveEdge,
} from "../shared";
import { SegmentedOrthogonalEdgeParams } from "./segmented-orthogonal-edge-params";
import { EventHandler } from "@/event-subject";
import { SegmentedOrthogonalEdgeModel } from "./segmented-orthogonal-edge-model";
import { SegmentedOrthogonalEdgeController } from "./segmented-orthogonal-edge-controller";

export class SegmentedOrthogonalEdgeShape implements StructuredEdgeShape {
  public readonly element: SVGSVGElement;

  public readonly view: StructuredEdgeView;

  public readonly onModelChange: EventHandler<SegmentedOrthogonalEdgeModel>;

  private readonly controller: SegmentedOrthogonalEdgeController;

  public constructor(params?: SegmentedOrthogonalEdgeParams | undefined) {
    this.controller = new SegmentedOrthogonalEdgeController({
      color: params?.color ?? edgeConstants.color,
      width: params?.width ?? edgeConstants.width,
      arrowLength: params?.arrowLength ?? edgeConstants.arrowLength,
      arrowRenderer: resolveArrowRenderer(
        params?.arrowRenderer ?? edgeConstants.arrowRenderer,
      ),
      arrowOffset: params?.arrowOffset ?? edgeConstants.arrowOffset,
      hasSourceArrow: params?.hasSourceArrow ?? edgeConstants.hasSourceArrow,
      hasTargetArrow: params?.hasTargetArrow ?? edgeConstants.hasTargetArrow,
      roundness: params?.roundness ?? edgeConstants.roundness,
    });

    this.view = this.controller.view;
    this.element = this.view.element;
    this.onModelChange = this.controller.onModelChange;

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
    this.controller.render(params);
  }
}
