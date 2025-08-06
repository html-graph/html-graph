import { EdgeShape } from "@/edges";

export interface GenericGraphEdge {
  readonly from: unknown;
  readonly to: unknown;
  readonly priority: number;
  readonly shape: EdgeShape;
}
