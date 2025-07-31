import { MouseEventVerifier } from "../shared";

export interface DraggableNodesParams {
  readonly moveOnTop: boolean;
  readonly moveEdgesOnTop: boolean;
  readonly dragCursor: string | null;
  readonly gridSize: number | null;
  readonly nodeDragVerifier: (nodeId: unknown) => boolean;
  readonly mouseDownEventVerifier: MouseEventVerifier;
  readonly mouseUpEventVerifier: MouseEventVerifier;
  readonly onNodeDrag: (nodeId: unknown) => void;
  readonly onNodeDragFinished: (nodeId: unknown) => void;
}
