import { EdgeShape } from "@/edges";
import { Identifier } from "@/identifier";

export interface AddEdgeRequest {
  readonly id: Identifier;
  readonly from: Identifier;
  readonly to: Identifier;
  readonly shape: EdgeShape;
  readonly priority: number;
}
