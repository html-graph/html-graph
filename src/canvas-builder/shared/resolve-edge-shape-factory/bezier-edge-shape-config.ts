import { BezierEdgeParams } from "@/edge-shapes";

export type BezierEdgeShapeConfig = {
  readonly type?: "bezier" | undefined;
} & BezierEdgeParams;
