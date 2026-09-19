import { EdgeShape } from "@/edge-shapes";
import { Identifier } from "@/identifier";

export interface GraphEdge {
  readonly from: Identifier;
  readonly to: Identifier;
  readonly priority: number;
  readonly shape: EdgeShape;
}
