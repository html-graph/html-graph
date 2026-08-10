import { EdgeElement } from "@/element";
import { EdgeRenderParams } from "./edge-render-params";

export interface EdgeShape {
  readonly element: EdgeElement;

  render(params: EdgeRenderParams): void;
}
