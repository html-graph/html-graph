import {
  EdgeRenderParams,
  edgeConstants,
  StructuredEdgeShape,
  resolveArrowRenderer,
  StructuredEdgeView,
  configureMidpoint,
  configureInteractiveEdge,
} from "../shared";
import { OrthogonalEdgeParams } from "./orthogonal-edge-params";
import { EventHandler } from "@/event-subject";
import { OrthogonalEdgeModel } from "./orthogonal-edge-model";
import { OrthogonalEdgeController } from "./orthogonal-edge-controller";

export class OrthogonalEdgeShape implements StructuredEdgeShape {
  public readonly element: SVGSVGElement;

  public readonly view: StructuredEdgeView;

  public readonly onModelChange: EventHandler<OrthogonalEdgeModel>;

  private readonly controller: OrthogonalEdgeController;

  public constructor(params?: OrthogonalEdgeParams | undefined) {
    this.controller = new OrthogonalEdgeController({
      color: params?.color ?? edgeConstants.color,
      width: params?.width ?? edgeConstants.width,
      arrowLength: params?.arrowLength ?? edgeConstants.arrowLength,
      arrowRenderer: resolveArrowRenderer(
        params?.arrowRenderer ?? edgeConstants.arrowRenderer,
      ),
      arrowOffset: params?.arrowOffset ?? edgeConstants.arrowOffset,
      hasSourceArrow: params?.hasSourceArrow ?? edgeConstants.hasSourceArrow,
      hasTargetArrow: params?.hasTargetArrow ?? edgeConstants.hasTargetArrow,
      cycleSquareSide: params?.cycleSquareSide ?? edgeConstants.cycleSquareSide,
      roundness: params?.roundness ?? edgeConstants.roundness,
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
