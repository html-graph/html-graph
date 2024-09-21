import { PortPayload } from "../store/port-payload";

export interface ConnectionController {
  readonly svg: SVGSVGElement;

  update: (
    width: number,
    height: number,
    x: number,
    y: number,
    from: PortPayload,
    to: PortPayload,
  ) => void;
}
