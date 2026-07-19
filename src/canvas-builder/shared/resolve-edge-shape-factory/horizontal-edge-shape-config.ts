import { HorizontalEdgeParams } from "@/edges";

/**
 * @deprecated
 * use type: "orthogonal" instead
 */
export type HorizontalEdgeShapeConfig = {
  readonly type: "horizontal";
} & HorizontalEdgeParams;
