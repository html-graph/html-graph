import { EdgeShape } from "@/edges";

export interface EdgePayload {
  from: string;
  to: string;
  shape: EdgeShape;
  priority: number;
}
