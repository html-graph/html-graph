import { BezierEdgeOptions } from "./bezier-edge-options";
import { CustomEdgeOptions } from "./custom-edge-options";
import { HorizontalEdgeOptions } from "./horizontal-edge-options";
import { StraightEdgeOptions } from "./straight-edge-options";
import { VerticalEdgeOptions } from "./vertical-edge-options";

export type EdgeOptions =
  | BezierEdgeOptions
  | StraightEdgeOptions
  | CustomEdgeOptions
  | HorizontalEdgeOptions
  | VerticalEdgeOptions;
