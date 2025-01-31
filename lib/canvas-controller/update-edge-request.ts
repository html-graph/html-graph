import { EdgeShapeFactory } from "@/edges";

export interface UpdateEdgeRequest {
  readonly edgeId: unknown;
  readonly shape: EdgeShapeFactory | undefined;
  readonly priority: number | undefined;
}
