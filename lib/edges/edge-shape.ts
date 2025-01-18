import { PortPayload } from "@/port-payload";

export interface EdgeShape {
  readonly svg: SVGSVGElement;

  update(
    x: number,
    y: number,
    width: number,
    height: number,
    from: PortPayload,
    to: PortPayload,
  ): void;

  attach(container: HTMLElement): void;

  detach(container: HTMLElement): void;

  setPriority(priority: number): void;
}
