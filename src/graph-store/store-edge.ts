import { EdgeShape } from "@/edge-shapes";
import { Identifier } from "@/identifier";

export interface StoreEdge {
  readonly from: Identifier;
  readonly to: Identifier;
  readonly payload: {
    shape: EdgeShape;
    priority: number;
  };
}
