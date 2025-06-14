import { BezierEdgeShapeConfig } from "./bezier-edge-shape-config";
import { EdgeShapeFactory } from "./edge-shape-factory";
import { HorizontalEdgeShapeConfig } from "./horizontal-edge-shape-config";
import { StraightEdgeShapeConfig } from "./straight-edge-shape-config";
import { VerticalEdgeShapeConfig } from "./vertical-edge-shape-config";

export type EdgeShapeConfig =
  | BezierEdgeShapeConfig
  | StraightEdgeShapeConfig
  | HorizontalEdgeShapeConfig
  | VerticalEdgeShapeConfig
  | EdgeShapeFactory;
