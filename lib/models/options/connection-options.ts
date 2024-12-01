import { BezierConnectionOptions } from "./bezier-connection-options";
import { CustomConnectionOptions } from "./custom-connection-options";
import { StraightConnectionOptions } from "./straight-connection-options";

export type ConnectionOptions =
  | BezierConnectionOptions
  | StraightConnectionOptions
  | CustomConnectionOptions;
