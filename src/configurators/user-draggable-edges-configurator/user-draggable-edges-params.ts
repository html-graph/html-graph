import { EdgeShapeFactory } from "@/canvas";
import { MouseEventVerifier } from "../shared";
import { DraggingEdgeResolver } from "./dragging-edge-resolver";

export interface UserDraggableEdgesParams {
  readonly mouseDownEventVerifier: MouseEventVerifier;
  readonly mouseUpEventVerifier: MouseEventVerifier;
  readonly draggingEdgeResolver: DraggingEdgeResolver;
  readonly edgeShapeFactory: EdgeShapeFactory;
}
