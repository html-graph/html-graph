import { Point } from "@/point";
import { Radius } from "@/radius";

export interface PortOffsetFnParams {
  readonly direction: Point;
  readonly radius: Radius;
}
