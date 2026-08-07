import { EdgeRenderParams } from "./edge-render-params";

export interface EdgeShape {
  readonly element: SVGSVGElement;

  render(params: EdgeRenderParams): void;
}
