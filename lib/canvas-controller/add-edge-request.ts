import { EdgeShape } from "@/edges";

export interface AddEdgeRequest {
  readonly id?: unknown | undefined;
  readonly from: unknown;
  readonly to: unknown;
  readonly shape?: EdgeShape | undefined;
  readonly priority?: number | undefined;
}
