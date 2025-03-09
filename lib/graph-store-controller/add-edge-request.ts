import { EdgeShape } from "@/edges";

export interface AddEdgeRequest {
  readonly id?: unknown;
  readonly from: unknown;
  readonly to: unknown;
  readonly shape?: EdgeShape;
  readonly priority?: number;
}
