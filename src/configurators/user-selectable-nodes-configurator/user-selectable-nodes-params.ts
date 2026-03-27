import { Canvas } from "@/canvas";
import { Identifier } from "@/identifier";

export interface UserSelectableNodesParams {
  readonly canvas: Canvas;
  readonly window: Window;
  readonly selectionCallback: (nodeIds: ReadonlySet<Identifier>) => void;
}
