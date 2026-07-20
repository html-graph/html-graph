import { EdgeRenderParams } from "./edge-render-params";

export interface EdgeShape {
  /**
   * @deprecated
   * use element instead
   */
  readonly svg: SVGSVGElement;

  readonly element: SVGSVGElement;

  render(params: EdgeRenderParams): void;
}
