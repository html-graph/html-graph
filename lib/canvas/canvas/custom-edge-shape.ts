import { EdgeShapeFactory } from "@/edges";

export interface CustomEdgeShape {
  readonly type: "custom";
  readonly factory: EdgeShapeFactory;
}
