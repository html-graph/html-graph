import { createHost, createLayer } from "./utils";

export class Layers {
  public readonly backgroundLayer = createLayer();

  public readonly mainLayer = createLayer();

  private readonly host = createHost();

  public constructor(private readonly element: HTMLElement) {
    this.element.appendChild(this.host);
    this.host.appendChild(this.backgroundLayer);
    this.host.appendChild(this.mainLayer);
  }

  public destroy(): void {
    this.host.removeChild(this.mainLayer);
    this.host.removeChild(this.backgroundLayer);
    this.element.removeChild(this.host);
  }
}
