import { Canvas } from "@/canvas";
import { createHost } from "./create-host";
import { createContainer } from "./create-container";

export class RectangularSelectionConfigurator {
  private readonly host = createHost();

  private readonly container = createContainer();

  private constructor(
    private readonly canvas: Canvas,
    private readonly overlayLayer: HTMLElement,
  ) {
    this.overlayLayer.appendChild(this.host);
    this.host.appendChild(this.container);

    this.applyTransform();
    this.canvas.viewport.onAfterUpdated.subscribe(() => {
      this.applyTransform();
    });
  }

  public static configure(canvas: Canvas, overlayLayer: HTMLElement): void {
    new RectangularSelectionConfigurator(canvas, overlayLayer);
  }

  private applyTransform(): void {
    const m = this.canvas.viewport.getContentMatrix();

    this.container.style.transform = `matrix(${m.scale}, 0, 0, ${m.scale}, ${m.x}, ${m.y})`;
  }
}
