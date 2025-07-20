import { AddEdgeRequest, EdgeShapeFactory } from "@/canvas";
import { ConnectionPreprocessor, MouseEventVerifier } from "../shared";
import { DraggingEdgeResolver } from "./dragging-edge-resolver";
import { DraggingEdgeReattachInterruptedPayload } from "./dragging-edge-reattach-interrupted-payload";

export interface UserDraggableEdgesParams {
  readonly connectionPreprocessor: ConnectionPreprocessor;
  readonly mouseDownEventVerifier: MouseEventVerifier;
  readonly mouseUpEventVerifier: MouseEventVerifier;
  readonly draggingEdgeResolver: DraggingEdgeResolver;
  readonly draggingEdgeShapeFactory: EdgeShapeFactory | null;
  readonly onAfterEdgeReattached: (edgeId: unknown) => void;
  readonly onEdgeReattachInterrupted: (
    payload: DraggingEdgeReattachInterruptedPayload,
  ) => void;
  readonly onEdgeReattachPrevented: (request: AddEdgeRequest) => void;
}
