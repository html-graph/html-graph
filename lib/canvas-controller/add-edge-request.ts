import { EdgeShape } from "@/edges";

export interface AddEdgeRequest {
  readonly edgeId: unknown | undefined;
  readonly from: unknown;
  readonly to: unknown;
  readonly shape: EdgeShape;
  readonly priority: number | undefined;
}
