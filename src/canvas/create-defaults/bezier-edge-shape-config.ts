import { BezierEdgeParams } from "@/edges";

export type BezierEdgeShapeConfig = {
  readonly type?: "bezier" | undefined;
} & BezierEdgeParams;
