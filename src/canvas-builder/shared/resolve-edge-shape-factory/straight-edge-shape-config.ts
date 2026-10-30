import { StraightEdgeParams } from "@/edge-shapes";

/**
 * @deprecated
 * use factory configuration instead
 * example:
 * shape: () => new StraightEdgeShape()
 */
export type StraightEdgeShapeConfig = {
  readonly type: "straight";
} & StraightEdgeParams;
