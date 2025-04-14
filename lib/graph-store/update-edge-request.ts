import { EdgeShape } from "@/edges";

export interface UpdateEdgeRequest {
  readonly from: unknown | undefined;
  readonly to: unknown | undefined;
  readonly shape: EdgeShape | undefined;
  readonly priority: number | undefined;
}
