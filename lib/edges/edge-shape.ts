import { PortPayload } from "@/port-payload";

export interface EdgeShape {
  readonly svg: SVGSVGElement;

  updatePosition(
    x: number,
    y: number,
    width: number,
    height: number,
    from: PortPayload,
    to: PortPayload,
  ): void;
}
