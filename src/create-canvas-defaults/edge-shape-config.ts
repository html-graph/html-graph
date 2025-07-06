import { BezierEdgeShapeConfig } from "./bezier-edge-shape-config";
import { HorizontalEdgeShapeConfig } from "./horizontal-edge-shape-config";
import { StraightEdgeShapeConfig } from "./straight-edge-shape-config";
import { VerticalEdgeShapeConfig } from "./vertical-edge-shape-config";
import { DirectEdgeShapeConfig } from "./direct-edge-shape-config";
import { EdgeShapeFactory } from "@/canvas";

export type EdgeShapeConfig =
  | BezierEdgeShapeConfig
  | StraightEdgeShapeConfig
  | HorizontalEdgeShapeConfig
  | VerticalEdgeShapeConfig
  | DirectEdgeShapeConfig
  | EdgeShapeFactory;
