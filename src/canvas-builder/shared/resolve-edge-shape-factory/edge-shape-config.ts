import { BezierEdgeShapeConfig } from "./bezier-edge-shape-config";
import { StraightEdgeShapeConfig } from "./straight-edge-shape-config";
import { DirectEdgeShapeConfig } from "./direct-edge-shape-config";
import { OrthogonalEdgeShapeConfig } from "./orthogonal-edge-shape-config";
import { EdgeShapeFactory } from "@/graph-controller";

export type EdgeShapeConfig =
  | BezierEdgeShapeConfig
  | StraightEdgeShapeConfig
  | DirectEdgeShapeConfig
  | OrthogonalEdgeShapeConfig
  | EdgeShapeFactory;
