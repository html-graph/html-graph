import { createHost, createLayer } from "./utils";

export class Layers {
  public readonly background = createLayer();

  public readonly main = createLayer();

  public readonly overlay = createLayer();

  private readonly host = createHost();

  public constructor(private readonly element: HTMLElement) {
    this.element.appendChild(this.host);
    this.host.appendChild(this.background);
    this.host.appendChild(this.main);
    this.overlay.style.pointerEvents = "none";
    this.host.appendChild(this.overlay);
  }

  public destroy(): void {
    this.host.removeChild(this.background);
    this.host.removeChild(this.main);
    this.host.removeChild(this.overlay);
    this.element.removeChild(this.host);
  }
}
