import { EdgeShapeFactory } from "@/edges";

export interface AddEdgeRequest {
  readonly edgeId: unknown | undefined;
  readonly fromPortId: string;
  readonly toPortId: string;
  readonly shapeFactory: EdgeShapeFactory;
  readonly priority: number | undefined;
}
