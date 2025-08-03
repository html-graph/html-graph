import { EdgeShape } from "@/edges";

export interface StoreEdge {
  readonly from: unknown;
  readonly to: unknown;
  readonly payload: {
    shape: EdgeShape;
    priority: number;
  };
}
