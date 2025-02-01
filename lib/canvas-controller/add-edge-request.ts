import { EdgeShapeFactory } from "@/edges";

export interface AddEdgeRequest {
  readonly edgeId: unknown | undefined;
  readonly from: unknown;
  readonly to: unknown;
  readonly shapeFactory: EdgeShapeFactory;
  readonly priority: number | undefined;
}
