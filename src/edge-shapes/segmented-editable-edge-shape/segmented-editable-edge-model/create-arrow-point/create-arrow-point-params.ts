import { Point } from "@/point";

export interface CreateArrowPointParams {
  readonly origin: Point;
  readonly direction: Point;
  readonly arrowLength: number;
  readonly hasArrow: boolean;
}
