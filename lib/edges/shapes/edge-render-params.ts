import { EdgeRenderPort } from "./edge-render-port";

export interface EdgeRenderParams {
  readonly source: EdgeRenderPort;
  readonly target: EdgeRenderPort;
}
