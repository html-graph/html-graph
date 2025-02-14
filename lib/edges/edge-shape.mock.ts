import { EdgeShape } from "./edge-shape";

export class EdgeShapeMock implements EdgeShape {
  public svg: SVGSVGElement = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "svg",
  );

  public render(): void {
    // mock method is intended to be dummy
  }
}
