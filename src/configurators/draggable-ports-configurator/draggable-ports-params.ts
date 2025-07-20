import { Point } from "@/point";
import { MouseEventVerifier } from "../shared";

export interface DraggablePortsParams {
  readonly mouseDownEventVerifier: MouseEventVerifier;
  readonly mouseUpEventVerifier: MouseEventVerifier;
  readonly onStopDrag: () => void;
  readonly onPortPointerDown: (
    clientPoint: Point,
    element: HTMLElement,
  ) => boolean;
  readonly onPointerMove: (clientPoint: Point) => void;
  readonly onPointerUp: (clientPoint: Point) => void;
}
