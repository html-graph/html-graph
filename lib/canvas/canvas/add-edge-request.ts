import { EdgeShape } from "./edge-options";

export interface AddEdgeRequest {
  readonly id?: unknown;
  readonly from: string;
  readonly to: string;
  readonly shape?: EdgeShape;
  readonly priority?: number;
}
