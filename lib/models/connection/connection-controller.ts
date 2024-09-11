import { PortPayload } from "../store/port-payload";

export interface ConnectionController {
  createSvg: () => SVGSVGElement;
  updateSvg: (
    svg: SVGSVGElement,
    width: number,
    height: number,
    from: PortPayload,
    tp: PortPayload,
  ) => void;
}
