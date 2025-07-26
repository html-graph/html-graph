import { ConnectionCategory } from "./connection-category";
import { EdgeRenderPort } from "./edge-render-port";

export interface EdgeRenderParams {
  readonly from: EdgeRenderPort;
  readonly to: EdgeRenderPort;
  readonly category: ConnectionCategory;
}
