import { DirectEdgeParams } from "@/edge-shapes";

/**
 * @deprecated
 * use factory configuration instead
 * example:
 * shape: () => new DirectEdgeShape()
 */
export type DirectEdgeShapeConfig = {
  readonly type: "direct";
} & DirectEdgeParams;
