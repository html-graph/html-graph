import { EdgeShape } from "@/edges";
import { Identifier } from "@/identifier";

export interface StoreEdge {
  readonly from: Identifier;
  readonly to: Identifier;
  readonly payload: {
    shape: EdgeShape;
    priority: number;
  };
}
