import { EdgeShape } from "@/edges";

export interface DraggingEdgeReattachInterruptedPayload {
  readonly staticPortId: unknown;
  readonly draggingPortId: unknown;
  readonly shape: EdgeShape;
  readonly isTargetDragging: boolean;
}
