import { EdgeShape } from "@/edges";

export interface GenericStoreEdge {
  readonly from: unknown;
  readonly to: unknown;
  readonly payload: {
    shape: EdgeShape;
    priority: number;
  };
}
