import { Canvas } from "@/canvas";
import { Identifier } from "@/identifier";
import { MouseEventVerifier } from "../shared";

export interface UserSelectableNodesParams {
  readonly element: HTMLElement;
  readonly canvas: Canvas;
  readonly window: Window;
  readonly onNodeSelected: (nodeId: Identifier) => void;
  readonly mouseDownEventVerifier: MouseEventVerifier;
  readonly mouseUpEventVerifier: MouseEventVerifier;
  readonly movementThreshold: number;
}
