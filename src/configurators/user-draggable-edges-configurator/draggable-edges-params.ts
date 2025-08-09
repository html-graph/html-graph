import { EdgeShapeFactory, GraphEdge } from "@/canvas";
import { ConnectionPreprocessor, MouseEventVerifier } from "../shared";
import { DraggingEdgeResolver } from "./dragging-edge-resolver";
import { Identifier } from "@/identifier";

export interface DraggableEdgesParams {
  readonly connectionPreprocessor: ConnectionPreprocessor;
  readonly mouseDownEventVerifier: MouseEventVerifier;
  readonly mouseUpEventVerifier: MouseEventVerifier;
  readonly draggingEdgeResolver: DraggingEdgeResolver;
  readonly draggingEdgeShapeFactory: EdgeShapeFactory | null;
  readonly onAfterEdgeReattached: (edgeId: Identifier) => void;
  readonly onEdgeReattachInterrupted: (
    payload: GraphEdge & { readonly id: Identifier },
  ) => void;
  readonly onEdgeReattachPrevented: (
    payload: GraphEdge & { readonly id: Identifier },
  ) => void;
}
