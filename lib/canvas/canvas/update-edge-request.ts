import { EdgeShape } from "@/edges";

export interface UpdateEdgeRequest {
  readonly shape?: EdgeShape;
  readonly priority?: number;
}
