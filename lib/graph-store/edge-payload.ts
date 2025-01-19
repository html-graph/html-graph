import { EdgeShape } from "@/edges";

export interface EdgePayload {
  readonly from: string;
  readonly to: string;
  shape: EdgeShape;
  priority: number;
}
