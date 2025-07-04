import { EdgeRenderParams } from "./edge-render-params";

// Responsibility: Rendering edge via SVG
export interface EdgeShape {
  readonly svg: SVGSVGElement;

  render(params: EdgeRenderParams): void;
}
