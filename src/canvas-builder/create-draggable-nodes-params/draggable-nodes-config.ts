import { MouseEventVerifier, NodeDragPayload } from "@/configurators";

export interface DraggableNodesConfig {
  readonly moveOnTop?: boolean;
  readonly moveEdgesOnTop?: boolean;
  readonly mouse?: {
    readonly dragCursor?: string | null;
    readonly mouseDownEventVerifier?: MouseEventVerifier;
    readonly mouseUpEventVerifier?: MouseEventVerifier;
  };
  readonly gridSize?: number | null;
  readonly nodeDragVerifier?: (payload: NodeDragPayload) => boolean;
  readonly events?: {
    readonly onNodeDrag?: (payload: NodeDragPayload) => void;
    readonly onNodeDragFinished?: (payload: NodeDragPayload) => void;
  };
}
