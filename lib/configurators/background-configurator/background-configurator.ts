import { Canvas } from "@/canvas";
import { createSvg } from "./utils";

/**
 * Responsibility: Configures background rendering behind graph
 */
export class BackgroundConfigurator {
  private readonly svg = createSvg();

  private readonly resizeObserver = new ResizeObserver((entries) => {
    const entry = entries[0];
    const { width, height } = entry.contentRect;

    this.svg.setAttribute("width", `${width}px`);
    this.svg.setAttribute("height", `${height}px`);
  });

  private readonly onBeforeDestroy = (): void => {
    this.resizeObserver.unobserve(this.host);
    this.host.removeChild(this.svg);
    this.canvas.onBeforeDestroy.unsubscribe(this.onBeforeDestroy);
  };

  private constructor(
    private readonly canvas: Canvas,
    private readonly host: HTMLElement,
  ) {
    this.host.prepend(this.svg);
    this.resizeObserver.observe(this.host);

    this.canvas.onBeforeDestroy.subscribe(this.onBeforeDestroy);
  }

  public static configure(canvas: Canvas, host: HTMLElement): void {
    new BackgroundConfigurator(canvas, host);
  }
}
