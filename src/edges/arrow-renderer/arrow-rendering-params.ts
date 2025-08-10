import { Point } from "@/point";

export interface ArrowRenderingParams {
  readonly direction: Point;
  readonly shift: Point;
  readonly arrowLength: number;
}
