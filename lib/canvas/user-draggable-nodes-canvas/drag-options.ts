import { NodeDragPayload } from "./node-drag-payload";

export interface DragOptions {
  grabPriorityStrategy?: "freeze" | "move-on-top";
  events?: {
    onNodeDrag?: (payload: NodeDragPayload) => void;
    onBeforeNodeDrag?: (payload: NodeDragPayload) => boolean;
  };
}
