import { EdgeRenderParams } from "./edge-render-params";

export interface EdgeShape {
  readonly svg: SVGSVGElement;

  render(params: EdgeRenderParams): void;
}
