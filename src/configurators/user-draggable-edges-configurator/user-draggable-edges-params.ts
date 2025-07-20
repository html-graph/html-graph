import { AddEdgeRequest, EdgeShapeFactory, GraphEdge } from "@/canvas";
import { ConnectionPreprocessor, MouseEventVerifier } from "../shared";
import { DraggingEdgeResolver } from "./dragging-edge-resolver";

export interface UserDraggableEdgesParams {
  readonly connectionPreprocessor: ConnectionPreprocessor;
  readonly mouseDownEventVerifier: MouseEventVerifier;
  readonly mouseUpEventVerifier: MouseEventVerifier;
  readonly draggingEdgeResolver: DraggingEdgeResolver;
  readonly draggingEdgeShapeFactory: EdgeShapeFactory | null;
  readonly onAfterEdgeReattached: (edgeId: unknown) => void;
  readonly onEdgeReattachInterrupted: (edge: GraphEdge) => void;
  readonly onEdgeReattachPrevented: (request: AddEdgeRequest) => void;
}
