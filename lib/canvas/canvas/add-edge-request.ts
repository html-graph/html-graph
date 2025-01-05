import { EdgeOptions } from "./edge-options";

export interface AddEdgeRequest {
  id?: unknown;
  from: string;
  to: string;
  options?: EdgeOptions;
  priority?: number;
}
