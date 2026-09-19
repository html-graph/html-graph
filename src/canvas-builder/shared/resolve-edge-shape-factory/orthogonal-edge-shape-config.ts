import { OrthogonalEdgeParams } from "@/edge-shapes";

export type OrthogonalEdgeShapeConfig = {
  readonly type: "orthogonal";
} & OrthogonalEdgeParams;
