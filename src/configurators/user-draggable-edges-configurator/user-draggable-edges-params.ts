import { EdgeShapeFactory } from "@/canvas";
import { MouseEventVerifier } from "../shared";

export interface UserDraggableEdgesParams {
  readonly mouseDownEventVerifier: MouseEventVerifier;
  readonly edgeShapeFactory: EdgeShapeFactory;
}
