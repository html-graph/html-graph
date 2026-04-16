import { EdgeRenderParams } from "./edge-render-params";

export interface EdgeShape {
  // TODO: rename to `element`
  readonly svg: SVGSVGElement;

  render(params: EdgeRenderParams): void;
}
