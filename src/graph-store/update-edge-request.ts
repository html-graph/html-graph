import { EdgeShape } from "@/edges";
import { Identifier } from "@/identifier";

export interface UpdateEdgeRequest {
  readonly from?: Identifier;
  readonly to?: Identifier;
  readonly shape?: EdgeShape;
  readonly priority?: number;
}
