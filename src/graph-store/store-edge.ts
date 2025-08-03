import { EdgeShape } from "@/edges";

export interface StoreEdge {
  readonly from: unknown;
  readonly to: unknown;
  shape: EdgeShape;
  priority: number;
}
