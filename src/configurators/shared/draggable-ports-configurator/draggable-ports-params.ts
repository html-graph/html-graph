import { Point } from "@/point";
import { MouseEventVerifier } from "../mouse-event-verifier";
import { Identifier } from "@/identifier";

export interface DraggablePortsParams {
  readonly mouseDownEventVerifier: MouseEventVerifier;
  readonly mouseUpEventVerifier: MouseEventVerifier;
  readonly onPointerDownVerifier: (
    portId: Identifier,
    clientPoint: Point,
  ) => boolean;
  readonly onPointerMove: (clientPoint: Point) => void;
  readonly onPointerOutside: () => void;
  readonly onPointerUp: (clientPoint: Point) => void;
}
