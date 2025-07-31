import { MouseEventVerifier } from "../shared";
import { NodeDragPayload } from "./node-drag-payload";

export interface DraggableNodesParams {
  readonly moveOnTop: boolean;
  readonly moveEdgesOnTop: boolean;
  readonly dragCursor: string | null;
  readonly gridSize: number | null;
  readonly nodeDragVerifier: (payload: NodeDragPayload) => boolean;
  readonly mouseDownEventVerifier: MouseEventVerifier;
  readonly mouseUpEventVerifier: MouseEventVerifier;
  readonly onNodeDrag: (payload: NodeDragPayload) => void;
  readonly onNodeDragFinished: (nodeId: NodeDragPayload) => void;
}
