import { Point } from "@/point";

export interface EdgeShape {
  readonly svg: SVGSVGElement;

  render(
    to: Point,
    flipX: number,
    flipY: number,
    fromDir: number,
    toDir: number,
  ): void;
}
