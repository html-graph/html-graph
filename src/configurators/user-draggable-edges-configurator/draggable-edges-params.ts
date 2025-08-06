import { EdgeShapeFactory } from "@/canvas";
import { ConnectionPreprocessor, MouseEventVerifier } from "../shared";
import { DraggingEdgeResolver } from "./dragging-edge-resolver";
import { GenericGraphEdge } from "@/generic-graph";

export interface DraggableEdgesParams {
  readonly connectionPreprocessor: ConnectionPreprocessor;
  readonly mouseDownEventVerifier: MouseEventVerifier;
  readonly mouseUpEventVerifier: MouseEventVerifier;
  readonly draggingEdgeResolver: DraggingEdgeResolver;
  readonly draggingEdgeShapeFactory: EdgeShapeFactory | null;
  readonly onAfterEdgeReattached: (edgeId: unknown) => void;
  readonly onEdgeReattachInterrupted: (
    payload: GenericGraphEdge & { readonly id: unknown },
  ) => void;
  readonly onEdgeReattachPrevented: (
    payload: GenericGraphEdge & { readonly id: unknown },
  ) => void;
}
