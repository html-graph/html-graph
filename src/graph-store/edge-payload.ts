import { EdgeShape } from "@/edges";

export interface EdgePayload {
  readonly from: unknown;
  readonly to: unknown;
  shape: EdgeShape;
  priority: number;
}
