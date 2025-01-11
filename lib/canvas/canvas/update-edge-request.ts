import { EdgeShape } from "@/edges";

export interface UpdateEdgeRequest {
  readonly controller?: EdgeShape;
  readonly priority?: number;
}
