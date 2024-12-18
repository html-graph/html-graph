import { BezierEdgeOptions } from "./bezier-edge-options";
import { CustomEdgeOptions } from "./custom-edge-options";
import { StraightEdgeOptions } from "./straight-edge-options";

export type EdgeOptions =
  | BezierEdgeOptions
  | StraightEdgeOptions
  | CustomEdgeOptions;
