import { createHost, createLayer } from "./utils";

export class Layers {
  public readonly background = createLayer();

  public readonly main = createLayer();

  public readonly overlayDraggableNodes = createLayer();

  private readonly host = createHost();

  public constructor(private readonly element: HTMLElement) {
    this.element.appendChild(this.host);
    this.host.appendChild(this.background);
    this.host.appendChild(this.main);
    this.overlayDraggableNodes.style.pointerEvents = "none";
    this.host.appendChild(this.overlayDraggableNodes);
  }

  public destroy(): void {
    this.host.removeChild(this.background);
    this.host.removeChild(this.main);
    this.host.removeChild(this.overlayDraggableNodes);
    this.element.removeChild(this.host);
  }
}
