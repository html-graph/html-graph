import { AddEdgeRequest, EdgeShapeFactory } from "@/canvas";
import { ConnectionPreprocessor, MouseEventVerifier } from "../shared";
import { DraggingEdgeResolver } from "./dragging-edge-resolver";

export interface UserDraggableEdgesParams {
  readonly connectionPreprocessor: ConnectionPreprocessor;
  readonly mouseDownEventVerifier: MouseEventVerifier;
  readonly mouseUpEventVerifier: MouseEventVerifier;
  readonly draggingEdgeResolver: DraggingEdgeResolver;
  readonly edgeShapeFactory: EdgeShapeFactory;
  readonly onAfterEdgeReattached: (edgeId: unknown) => void;
  readonly onEdgeReattachInterrupted: (
    staticPortId: unknown,
    isDirect: boolean,
  ) => void;
  readonly onEdgeReattachPrevented: (request: AddEdgeRequest) => void;
}
