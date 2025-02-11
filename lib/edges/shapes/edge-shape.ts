import { RenderParams } from "./render-params";

export interface EdgeShape {
  readonly svg: SVGSVGElement;

  render(params: RenderParams): void;
}
