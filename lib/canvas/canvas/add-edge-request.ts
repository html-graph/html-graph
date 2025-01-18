import { EdgeShape } from "./edge-options";

export interface AddEdgeRequest {
  id?: unknown;
  from: string;
  to: string;
  shape?: EdgeShape;
  priority?: number;
}
