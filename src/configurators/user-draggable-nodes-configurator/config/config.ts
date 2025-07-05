import { MouseEventVerifier } from "../../shared";
import { NodeDragPayload } from "../node-drag-payload";

export interface Config {
  readonly moveNodesOnTop: boolean;
  readonly moveEdgesOnTop: boolean;
  readonly dragCursor: string | null;
  readonly mouseDownEventVerifier: MouseEventVerifier;
  readonly mouseUpEventVerifier: MouseEventVerifier;
  readonly onNodeDrag: (payload: NodeDragPayload) => void;
  readonly onBeforeNodeDrag: (payload: NodeDragPayload) => boolean;
  readonly onNodeDragFinished: (nodeId: NodeDragPayload) => void;
}
