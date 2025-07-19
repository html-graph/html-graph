import { createHost } from "./create-host";
import { createLayer } from "./create-layer";
import { createOverlayLayer } from "./create-overlay-layer";

export class Layers {
  public readonly background = createLayer();

  public readonly main = createLayer();

  public readonly overlayConnectablePorts = createOverlayLayer();

  public readonly overlayDraggableEdges = createOverlayLayer();

  private readonly host = createHost();

  public constructor(private readonly element: HTMLElement) {
    this.element.appendChild(this.host);
    this.host.appendChild(this.background);
    this.host.appendChild(this.main);
    this.host.appendChild(this.overlayConnectablePorts);
    this.host.appendChild(this.overlayDraggableEdges);
  }

  public destroy(): void {
    this.host.removeChild(this.background);
    this.host.removeChild(this.main);
    this.host.removeChild(this.overlayConnectablePorts);
    this.host.removeChild(this.overlayDraggableEdges);
    this.element.removeChild(this.host);
  }
}
