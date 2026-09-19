import { EdgeShape } from "@/edge-shapes";
import { Identifier } from "@/identifier";

export interface AddEdgeRequest {
  readonly id: Identifier;
  readonly from: Identifier;
  readonly to: Identifier;
  readonly shape: EdgeShape;
  readonly priority: number;
}
