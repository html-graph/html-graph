import { PortPayload } from "../store/port-payload";

export interface ConnectionController {
  readonly svg: SVGSVGElement;

  update(
    x: number,
    y: number,
    width: number,
    height: number,
    from: PortPayload,
    to: PortPayload,
  ): void;
}
