import { createContainer } from "./create-container";
import { Layer } from "./layer";

export class EdgesFollowNodeLayer implements Layer {
  private readonly container = createContainer();

  public constructor(private readonly host: HTMLElement) {
    this.host.appendChild(this.container);
  }

  public appendNodeElement(element: HTMLElement): void {
    this.container.appendChild(element);
  }

  public removeNodeElement(element: HTMLElement): void {
    this.container.removeChild(element);
  }

  public appendEdgeElement(element: SVGSVGElement): void {
    this.container.appendChild(element);
  }

  public removeEdgeElement(element: SVGSVGElement): void {
    this.container.removeChild(element);
  }

  public update(sv: number, xv: number, yv: number): void {
    this.container.style.transform = `matrix(${sv}, 0, 0, ${sv}, ${xv}, ${yv})`;
  }

  public destroy(): void {
    this.host.removeChild(this.container);
  }
}
