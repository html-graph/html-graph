import { PortPayload } from "../graph-store";

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