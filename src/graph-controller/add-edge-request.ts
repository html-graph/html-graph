import { EdgeShape } from "@/edges";
import { Identifier } from "@/identifier";

export interface AddEdgeRequest {
  readonly id?: Identifier | undefined;
  readonly from: Identifier;
  readonly to: Identifier;
  readonly shape?: EdgeShape | undefined;
  readonly priority?: number | undefined;
}
