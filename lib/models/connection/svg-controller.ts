export interface SvgController {
  createSvg: () => SVGSVGElement;
  updateSvg: (svg: SVGSVGElement, width: number, height: number) => void;
}
