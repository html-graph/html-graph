import { BezierEdgeParams } from "@/edge-shapes";

/**
 * @deprecated
 * use factory configuration instead
 * example:
 * shape: () => new BezierEdgeShape()
 */
export type BezierEdgeShapeConfig = {
  readonly type?: "bezier" | undefined;
} & BezierEdgeParams;
