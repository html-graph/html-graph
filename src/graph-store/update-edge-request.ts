import { EdgeShape } from "@/edge-shapes";
import { Identifier } from "@/identifier";

export interface UpdateEdgeRequest {
  readonly from?: Identifier;
  readonly to?: Identifier;
  readonly shape?: EdgeShape;
  readonly priority?: number;
}
