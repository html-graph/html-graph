import { NodeDragPayload } from "../node-drag-payload";
import { MouseEventVerifier } from "../../shared";

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
