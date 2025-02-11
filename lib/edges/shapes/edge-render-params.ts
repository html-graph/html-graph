import { Point } from "@/point";
import { EdgeRenderPort } from "./edge-render-port";

export interface EdgeRenderParams {
  readonly source: EdgeRenderPort;
  readonly target: EdgeRenderPort;
  readonly to: Point;
  readonly flipX: number;
  readonly flipY: number;
  readonly fromDir: number;
  readonly toDir: number;
}
