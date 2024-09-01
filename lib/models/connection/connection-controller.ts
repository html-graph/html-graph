export interface ConnectionController {
  createSvg: () => SVGSVGElement;
  updateSvg: (
    svg: SVGSVGElement,
    width: number,
    height: number,
    fromElement: HTMLElement,
    toElement: HTMLElement,
  ) => void;
}
