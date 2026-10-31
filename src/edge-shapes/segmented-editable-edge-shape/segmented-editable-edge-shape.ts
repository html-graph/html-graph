import {
  EdgeRenderParams,
  edgeConstants,
  StructuredEdgeShape,
  resolveArrowRenderer,
  StructuredEdgeView,
  configureMidpoint,
  configureInteractiveEdge,
} from "../shared";
import { SegmentedEditableEdgeParams } from "./segmented-editable-edge-params";
import { EventHandler } from "@/event-subject";
import { SegmentedEditableEdgeModel } from "./segmented-editable-edge-model";
import {
  SegmentedEditableEdgeController,
  Waypoints,
} from "./segmented-editable-edge-controller";
import { Viewport } from "@/viewport";

export class SegmentedEditableEdgeShape implements StructuredEdgeShape {
  public readonly element: SVGSVGElement;

  public readonly view: StructuredEdgeView;

  public readonly waypoints: Waypoints;

  public readonly onModelChange: EventHandler<SegmentedEditableEdgeModel>;

  private readonly controller: SegmentedEditableEdgeController;

  public constructor(
    canvasViewport: Viewport,
    params?: SegmentedEditableEdgeParams | undefined,
  ) {
    this.controller = new SegmentedEditableEdgeController({
      canvasViewport,
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
    this.waypoints = this.controller.waypoints;

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
