import { NodeDragPayload } from "./node-drag-payload";

export interface DragOptions {
  readonly grabPriorityStrategy?: "freeze" | "move-on-top";
  readonly dragCursor?: string | null;
  readonly events?: {
    readonly onNodeDrag?: (payload: NodeDragPayload) => void;
    readonly onBeforeNodeDrag?: (payload: NodeDragPayload) => boolean;
  };
}
