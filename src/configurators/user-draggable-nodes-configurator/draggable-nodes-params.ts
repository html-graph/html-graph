import { Identifier } from "@/identifier";
import { MouseEventVerifier } from "../shared";

export interface DraggableNodesParams {
  readonly moveOnTop: boolean;
  readonly moveEdgesOnTop: boolean;
  readonly dragCursor: string | null;
  readonly gridSize: number | null;
  readonly nodeDragVerifier: (nodeId: Identifier) => boolean;
  readonly mouseDownEventVerifier: MouseEventVerifier;
  readonly mouseUpEventVerifier: MouseEventVerifier;
  readonly onNodeDragStarted: (nodeId: Identifier) => void;
  readonly onNodeDrag: (nodeId: Identifier) => void;
  readonly onNodeDragFinished: (nodeId: Identifier) => void;
}
