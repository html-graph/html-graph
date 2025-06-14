import { MouseEventVerifier } from "../../shared";
import { NodeDragPayload } from "../node-drag-payload";

export interface Options {
  readonly freezePriority: boolean;
  readonly dragCursor: string | null;
  readonly mouseDownEventVerifier: MouseEventVerifier;
  readonly mouseUpEventVerifier: MouseEventVerifier;
  readonly onNodeDrag: (payload: NodeDragPayload) => void;
  readonly onBeforeNodeDrag: (payload: NodeDragPayload) => boolean;
  readonly onNodeDragFinished: (nodeId: NodeDragPayload) => void;
}
