import { EdgeShape } from "@/edges";

export interface UpdateEdgeRequest {
  readonly from?: unknown;
  readonly to?: unknown;
  readonly shape?: EdgeShape;
  readonly priority?: number;
}
