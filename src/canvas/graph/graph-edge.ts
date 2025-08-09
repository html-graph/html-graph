import { EdgeShape } from "@/edges";
import { Identifier } from "@/identifier";

export interface GraphEdge {
  readonly from: Identifier;
  readonly to: Identifier;
  readonly priority: number;
  readonly shape: EdgeShape;
}
