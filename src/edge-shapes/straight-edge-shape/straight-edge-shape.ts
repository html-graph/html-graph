import {
  EdgeRenderParams,
  edgeConstants,
  StructuredEdgeShape,
  resolveArrowRenderer,
  StructuredEdgeView,
  configureMidpoint,
  configureInteractiveEdge,
} from "../shared";
import { StraightEdgeController } from "./straight-edge-controller";
import { StraightEdgeModel } from "./straight-edge-model";
import { StraightEdgeParams } from "./straight-edge-params";
import { EventHandler } from "@/event-subject";

export class StraightEdgeShape implements StructuredEdgeShape {
  public readonly element: SVGSVGElement;

  public readonly view: StructuredEdgeView;

  public readonly onModelChange: EventHandler<StraightEdgeModel>;

  private readonly controller: StraightEdgeController;

  public constructor(params?: StraightEdgeParams | undefined) {
    this.controller = new StraightEdgeController({
      color: params?.color ?? edgeConstants.color,
      width: params?.width ?? edgeConstants.width,
      arrowRenderer: resolveArrowRenderer(
        params?.arrowRenderer ?? edgeConstants.arrowRenderer,
      ),
      arrowLength: params?.arrowLength ?? edgeConstants.arrowLength,
      arrowOffset: params?.arrowOffset ?? edgeConstants.arrowOffset,
      hasSourceArrow: params?.hasSourceArrow ?? edgeConstants.hasSourceArrow,
      hasTargetArrow: params?.hasTargetArrow ?? edgeConstants.hasTargetArrow,
      detourDirection: params?.detourDirection ?? edgeConstants.detourDirection,
      detourDistance: params?.detourDistance ?? edgeConstants.detourDistance,
      cycleSquareSide: params?.cycleSquareSide ?? edgeConstants.cycleSquareSide,
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
