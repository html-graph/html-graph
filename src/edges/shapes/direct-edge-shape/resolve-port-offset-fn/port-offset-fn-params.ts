import { Dimensions } from "@/dimensions";
import { Point } from "@/point";

export interface PortOffsetFnParams {
  readonly direction: Point;
  readonly dimensions: Dimensions;
}
