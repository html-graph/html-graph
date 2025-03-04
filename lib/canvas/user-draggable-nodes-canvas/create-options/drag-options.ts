import { NodeDragPayload } from "../node-drag-payload";

export interface DragOptions {
  readonly moveOnTop?: boolean;
  readonly mouse?: {
    readonly dragCursor?: string | null;
    readonly mouseDownEventVerifier?: (event: MouseEvent) => boolean;
    readonly mouseUpEventVerifier?: (event: MouseEvent) => boolean;
  };
  readonly events?: {
    readonly onNodeDrag?: (payload: NodeDragPayload) => void;
    readonly onBeforeNodeDrag?: (payload: NodeDragPayload) => boolean;
    readonly onNodeDragFinished?: (payload: NodeDragPayload) => void;
  };
}
