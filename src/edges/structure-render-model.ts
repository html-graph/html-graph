import { EdgePath } from "./shared";

export interface StructuredEdgeRenderModel {
  readonly edgePath: EdgePath;
  readonly sourceArrowPath: string | null;
  readonly targetArrowPath: string | null;
}
