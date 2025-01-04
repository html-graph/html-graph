import { EdgeController } from "@/edges";

export interface UpdateEdgeRequest {
  readonly controller?: EdgeController;
  readonly priority?: number;
}
