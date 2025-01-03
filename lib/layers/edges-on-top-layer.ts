import { createContainer } from "./create-container";
import { Layer } from "./layer";

export class EdgesOnTopLayer implements Layer {
  private readonly nodesContainer = createContainer();

  private readonly edgesContainer = createContainer();

  public constructor(private readonly host: HTMLElement) {
    this.host.appendChild(this.nodesContainer);
    this.host.appendChild(this.edgesContainer);
  }

  public appendNodeElement(element: HTMLElement): void {
    this.nodesContainer.appendChild(element);
  }

  public removeNodeElement(element: HTMLElement): void {
    this.nodesContainer.removeChild(element);
  }

  public appendEdgeElement(element: SVGSVGElement): void {
    this.edgesContainer.appendChild(element);
  }

  public removeEdgeElement(element: SVGSVGElement): void {
    this.edgesContainer.removeChild(element);
  }

  public update(sv: number, xv: number, yv: number): void {
    this.nodesContainer.style.transform = `matrix(${sv}, 0, 0, ${sv}, ${xv}, ${yv})`;
    this.edgesContainer.style.transform = `matrix(${sv}, 0, 0, ${sv}, ${xv}, ${yv})`;
  }

  public destroy(): void {
    this.host.removeChild(this.nodesContainer);
    this.host.removeChild(this.edgesContainer);
  }
}
