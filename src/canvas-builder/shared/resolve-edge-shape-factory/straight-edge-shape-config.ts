import { StraightEdgeParams } from "@/edge-shapes";

export type StraightEdgeShapeConfig = {
  readonly type: "straight";
} & StraightEdgeParams;
