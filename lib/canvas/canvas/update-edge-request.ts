import { EdgeShape } from "./edge-options";

export interface UpdateEdgeRequest {
  readonly shape?: EdgeShape;
  readonly priority?: number;
}
