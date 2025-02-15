import { EdgeShape } from "@/edges";

export interface UpdateEdgeRequest {
  readonly edgeId: unknown;
  readonly shape: EdgeShape | undefined;
  readonly priority: number | undefined;
}
