import { Point } from "@/point";
import { Radii } from "@/radii";

export interface PortOffsetFnParams {
  readonly direction: Point;
  readonly radius: Radii;
}
