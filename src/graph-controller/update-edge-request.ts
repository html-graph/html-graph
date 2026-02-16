import { EdgeShape } from "@/edges";
import { Identifier } from "@/identifier";

export interface UpdateEdgeRequest {
  readonly from?: Identifier | undefined;
  readonly to?: Identifier | undefined;
  readonly shape?: EdgeShape | undefined;
  readonly priority?: number | undefined;
}
