import { Dimensions } from "@/dimensions";
import { Point } from "@/point";

export type PortOffsetFn = (direction: Point, dimensions: Dimensions) => number;
