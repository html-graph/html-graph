import { OrthogonalEdgeParams } from "@/edge-shapes";

/**
 * @deprecated
 * use factory configuration instead
 * example:
 * shape: () => new OrthogonalEdgeShape()
 */
export type OrthogonalEdgeShapeConfig = {
  readonly type: "orthogonal";
} & OrthogonalEdgeParams;
