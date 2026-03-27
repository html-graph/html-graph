import { Canvas } from "@/canvas";
import { Identifier } from "@/identifier";
import { MouseEventVerifier } from "../shared";

export interface UserSelectableNodesParams {
  readonly canvas: Canvas;
  readonly window: Window;
  readonly selectionCallback: (nodeIds: ReadonlySet<Identifier>) => void;
  readonly mouseDownEventVerifier: MouseEventVerifier;
  readonly mouseUpEventVerifier: MouseEventVerifier;
}
