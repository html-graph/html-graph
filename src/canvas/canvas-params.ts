import { GraphControllerParams } from "@/graph-controller";
import { ViewportControllerParams } from "@/viewport-controller";

export interface CanvasParams {
  readonly graphControllerParams: GraphControllerParams;
  readonly viewportControllerParams: ViewportControllerParams;
}
