import { VerticalEdgeParams } from "@/edges";

/**
 * @deprecated
 * use type: "orthogonal" instead
 */
export type VerticalEdgeShapeConfig = {
  readonly type: "vertical";
} & VerticalEdgeParams;
