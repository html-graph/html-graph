import { GraphPort } from "@/graph-store";

export interface EdgeShape {
  readonly svg: SVGSVGElement;

  update(
    x: number,
    y: number,
    width: number,
    height: number,
    from: GraphPort,
    to: GraphPort,
  ): void;
}
