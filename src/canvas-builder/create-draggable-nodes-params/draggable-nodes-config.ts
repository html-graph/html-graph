import { MouseEventVerifier, NodeDragPayload } from "@/configurators";

export interface DraggableNodesConfig {
  readonly moveOnTop?: boolean;
  readonly moveEdgesOnTop?: boolean;
  readonly mouse?: {
    readonly dragCursor?: string | null;
    readonly mouseDownEventVerifier?: MouseEventVerifier;
    readonly mouseUpEventVerifier?: MouseEventVerifier;
  };
  readonly events?: {
    readonly onNodeDrag?: (payload: NodeDragPayload) => void;
    readonly onBeforeNodeDrag?: (payload: NodeDragPayload) => boolean;
    readonly onNodeDragFinished?: (payload: NodeDragPayload) => void;
  };
}
