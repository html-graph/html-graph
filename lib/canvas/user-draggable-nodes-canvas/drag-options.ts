import { NodeDragPayload } from "./node-drag-payload";

export interface DragOptions {
  readonly moveOnTop?: boolean;
  readonly mouse?: {
    readonly dragCursor?: string | null;
    readonly mouseDownEventValidator?: (event: MouseEvent) => boolean;
    readonly mouseUpEventValidator?: (event: MouseEvent) => boolean;
  };
  readonly events?: {
    readonly onNodeDrag?: (payload: NodeDragPayload) => void;
    readonly onBeforeNodeDrag?: (payload: NodeDragPayload) => boolean;
    readonly onNodeDragFinished?: (nodeId: NodeDragPayload) => void;
  };
}
