import { NodeDragPayload } from "../node-drag-payload";

export interface Options {
  readonly freezePriority: boolean;
  readonly dragCursor: string | null;
  readonly mouseDownEventValidator: (event: MouseEvent) => boolean;
  readonly mouseUpEventValidator: (event: MouseEvent) => boolean;
  readonly onNodeDrag: (payload: NodeDragPayload) => void;
  readonly onBeforeNodeDrag: (payload: NodeDragPayload) => boolean;
  readonly onNodeDragFinished: (nodeId: NodeDragPayload) => void;
}
