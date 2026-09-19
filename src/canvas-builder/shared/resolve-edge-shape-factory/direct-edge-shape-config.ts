import { DirectEdgeParams } from "@/edge-shapes";

export type DirectEdgeShapeConfig = {
  readonly type: "direct";
} & DirectEdgeParams;
