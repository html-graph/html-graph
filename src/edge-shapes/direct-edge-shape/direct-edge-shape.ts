import {
  EdgeRenderParams,
  StructuredEdgeShape,
  edgeConstants,
  resolveArrowRenderer,
  StructuredEdgeView,
  configureMidpoint,
  configureInteractiveEdge,
} from "../shared";
import { DirectEdgeParams } from "./direct-edge-params";
import { EventHandler } from "@/event-subject";
import { resolvePortOffsetFn } from "./resolve-port-offset-fn";
import { DirectEdgeModel } from "./direct-edge-model";
import { DirectEdgeController } from "./direct-edge-controller";

export class DirectEdgeShape implements StructuredEdgeShape {
  public readonly element: SVGSVGElement;

  public readonly view: StructuredEdgeView;

  public readonly onModelChange: EventHandler<DirectEdgeModel>;

  private readonly controller: DirectEdgeController;

  public constructor(params?: DirectEdgeParams | undefined) {
    this.controller = new DirectEdgeController({
      color: params?.color ?? edgeConstants.color,
      width: params?.width ?? edgeConstants.width,
      hasSourceArrow: params?.hasSourceArrow ?? edgeConstants.hasSourceArrow,
      hasTargetArrow: params?.hasTargetArrow ?? edgeConstants.hasTargetArrow,
      arrowLength: params?.arrowLength ?? edgeConstants.arrowLength,
      arrowRenderer: resolveArrowRenderer(params?.arrowRenderer ?? {}),
      sourceOffsetFn: resolvePortOffsetFn(
        params?.sourceOffset ?? edgeConstants.portOffset,
      ),
      targetOffsetFn: resolvePortOffsetFn(
        params?.targetOffset ?? edgeConstants.portOffset,
      ),
    });

    this.element = this.controller.view.element;
    this.view = this.controller.view;
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
