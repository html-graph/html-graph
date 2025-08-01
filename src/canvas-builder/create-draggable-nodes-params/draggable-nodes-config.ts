import { MouseEventVerifier } from "@/configurators";

export interface DraggableNodesConfig {
  readonly moveOnTop?: boolean;
  readonly moveEdgesOnTop?: boolean;
  readonly gridSize?: number | null;
  readonly nodeDragVerifier?: (nodeId: unknown) => boolean;
  readonly mouse?: {
    readonly dragCursor?: string | null;
    readonly mouseDownEventVerifier?: MouseEventVerifier;
    readonly mouseUpEventVerifier?: MouseEventVerifier;
  };
  readonly events?: {
    readonly onNodeDrag?: (nodeId: unknown) => void;
    readonly onNodeDragFinished?: (nodeId: unknown) => void;
  };
}
