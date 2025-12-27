import { MouseEventVerifier } from "@/configurators";
import { Identifier } from "@/identifier";

export interface DraggableNodesConfig {
  readonly moveOnTop?: boolean;
  readonly moveEdgesOnTop?: boolean;
  readonly gridSize?: number | null;
  readonly nodeDragVerifier?: (nodeId: Identifier) => boolean;
  readonly mouse?: {
    readonly dragCursor?: string | null;
    readonly mouseDownEventVerifier?: MouseEventVerifier;
    readonly mouseUpEventVerifier?: MouseEventVerifier;
  };
  readonly events?: {
    readonly onNodeDragStarted?: (nodeId: Identifier) => void;
    readonly onNodeDrag?: (nodeId: Identifier) => void;
    readonly onNodeDragFinished?: (nodeId: Identifier) => void;
  };
}
