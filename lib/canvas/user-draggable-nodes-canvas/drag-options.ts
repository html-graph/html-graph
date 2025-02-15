import { NodeDragPayload } from "./node-drag-payload";

export interface DragOptions {
  readonly moveOnTop?: boolean;
  readonly dragCursor?: string | null;
  readonly events?: {
    readonly onNodeDrag?: (payload: NodeDragPayload) => void;
    readonly onBeforeNodeDrag?: (payload: NodeDragPayload) => boolean;
    readonly onNodeDragFinished?: (nodeId: NodeDragPayload) => void;
  };
}
