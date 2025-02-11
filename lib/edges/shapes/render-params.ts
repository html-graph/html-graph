import { Point } from "@/point";

export interface RenderParams {
  readonly to: Point;
  readonly flipX: number;
  readonly flipY: number;
  readonly fromDir: number;
  readonly toDir: number;
}
