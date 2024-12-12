import { NodeDragPayload } from "./node-drag-payload";

export interface DragOptions {
  events?: {
    onNodeDrag?: (payload: NodeDragPayload) => void;
  };
}
