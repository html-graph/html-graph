import { EdgeShapeFactory } from "@/edges";
import { BezierEdgeShape } from "./bezier-edge-shape";
import { HorizontalEdgeShape } from "./horizontal-edge-shape";
import { StraightEdgeShape } from "./straight-edge-shape";
import { VerticalEdgeShape } from "./vertical-edge-shape";

export type EdgeShape =
  | BezierEdgeShape
  | StraightEdgeShape
  | HorizontalEdgeShape
  | VerticalEdgeShape
  | EdgeShapeFactory;
