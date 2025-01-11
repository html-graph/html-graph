import { EdgeShape } from "./edge-options";

export interface AddEdgeRequest {
  id?: unknown;
  from: string;
  to: string;
  options?: EdgeShape;
  priority?: number;
}
