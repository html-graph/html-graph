import { Canvas } from "@/canvas";
import { MouseEventVerifier } from "../shared";

export interface UserSelectableCanvasParams {
  readonly canvas: Canvas;
  readonly element: HTMLElement;
  readonly window: Window;
  readonly onCanvasSelected: () => void;
  readonly mouseDownEventVerifier: MouseEventVerifier;
  readonly mouseUpEventVerifier: MouseEventVerifier;
  readonly movementThreshold: number;
}
