import { EdgeShape } from "@/edges";

export interface AddEdgeRequest {
  readonly id?: unknown | undefined;
  readonly from: string;
  readonly to: string;
  readonly shape?: EdgeShape | undefined;
  readonly priority?: number | undefined;
}
