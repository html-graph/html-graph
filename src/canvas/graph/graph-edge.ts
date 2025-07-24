import { EdgeShape } from "@/edges";

export interface GraphEdge {
  readonly from: unknown;
  readonly to: unknown;
  readonly priority: number;
  readonly shape: EdgeShape;
}
