export interface Layer {
  appendNodeElement(element: HTMLElement): void;

  removeNodeElement(element: HTMLElement): void;

  appendEdgeElement(element: SVGSVGElement): void;

  removeEdgeElement(element: SVGSVGElement): void;

  update(sv: number, xv: number, yv: number): void;

  destroy(): void;
}
