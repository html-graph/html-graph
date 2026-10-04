import { EventHandler } from "@/event-subject";
import {
  EdgeRenderParams,
  edgeConstants,
  StructuredEdgeShape,
  resolveArrowRenderer,
  StructuredEdgeView,
  configureMidpoint,
  configureInteractiveEdge,
} from "../shared";
import { BezierEdgeParams } from "./bezier-edge-params";
import { BezierEdgeModel } from "./bezier-edge-model";
import { BezierEdgeController } from "./bezier-edge-controller";

export class BezierEdgeShape implements StructuredEdgeShape {
  public readonly element: SVGSVGElement;

  public readonly view: StructuredEdgeView;

  public readonly onModelChange: EventHandler<BezierEdgeModel>;

  private readonly controller: BezierEdgeController;

  public constructor(params?: BezierEdgeParams | undefined) {
    this.controller = new BezierEdgeController({
      arrowLength: params?.arrowLength ?? edgeConstants.arrowLength,
      color: params?.color ?? edgeConstants.color,
      width: params?.width ?? edgeConstants.width,
      arrowRenderer: resolveArrowRenderer(params?.arrowRenderer ?? {}),
      hasSourceArrow: params?.hasSourceArrow ?? edgeConstants.hasSourceArrow,
      hasTargetArrow: params?.hasTargetArrow ?? edgeConstants.hasTargetArrow,
      curvature: params?.curvature ?? edgeConstants.curvature,
      portCycleRadius: params?.cycleRadius ?? edgeConstants.cycleRadius,
      portCycleSmallRadius:
        params?.smallCycleRadius ?? edgeConstants.smallCycleRadius,
      detourDirection: params?.detourDirection ?? edgeConstants.detourDirection,
      detourDistance: params?.detourDistance ?? edgeConstants.detourDistance,
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
