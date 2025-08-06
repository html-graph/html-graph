import { EdgeShapeFactory } from "@/canvas";
import { ConnectionPreprocessor, MouseEventVerifier } from "../shared";
import { DraggingEdgeResolver } from "./dragging-edge-resolver";
import { GraphEdge } from "@/graph";

export interface DraggableEdgesParams {
  readonly connectionPreprocessor: ConnectionPreprocessor;
  readonly mouseDownEventVerifier: MouseEventVerifier;
  readonly mouseUpEventVerifier: MouseEventVerifier;
  readonly draggingEdgeResolver: DraggingEdgeResolver;
  readonly draggingEdgeShapeFactory: EdgeShapeFactory | null;
  readonly onAfterEdgeReattached: (edgeId: unknown) => void;
  readonly onEdgeReattachInterrupted: (
    payload: GraphEdge & { readonly id: unknown },
  ) => void;
  readonly onEdgeReattachPrevented: (
    payload: GraphEdge & { readonly id: unknown },
  ) => void;
}
