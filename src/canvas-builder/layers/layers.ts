import { createHost } from "./create-host";
import { createLayer } from "./create-layer";
import { createOverlayLayer } from "./create-overlay-layer";

export class Layers {
  public readonly background = createLayer(0);

  public readonly main = createLayer(1);

  public readonly overlayConnectablePorts = createOverlayLayer(1);

  public readonly overlayDraggableEdges = createOverlayLayer(1);

  public readonly overlayRectangularSelection = createOverlayLayer(2);

  private readonly host = createHost();

  public constructor(private readonly element: HTMLElement) {
    this.element.appendChild(this.host);
    this.host.appendChild(this.background);
    this.host.appendChild(this.main);
    this.host.appendChild(this.overlayConnectablePorts);
    this.host.appendChild(this.overlayDraggableEdges);
    this.host.appendChild(this.overlayRectangularSelection);
  }

  public destroy(): void {
    this.host.removeChild(this.background);
    this.host.removeChild(this.main);
    this.host.removeChild(this.overlayConnectablePorts);
    this.host.removeChild(this.overlayDraggableEdges);
    this.host.removeChild(this.overlayRectangularSelection);
    this.element.removeChild(this.host);
  }
}
