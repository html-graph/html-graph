import { EdgeOptions } from "./edge-options";

export interface AddEdgeRequest {
  id?: string;
  from: string;
  to: string;
  options?: EdgeOptions;
}
