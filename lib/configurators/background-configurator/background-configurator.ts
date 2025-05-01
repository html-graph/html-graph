import { Canvas } from "@/canvas";
import { createContent, createPattern, createRect, createSvg } from "./utils";

/**
 * Responsibility: Configures background rendering behind graph
 */
export class BackgroundConfigurator {
  private readonly svg = createSvg();

  private readonly patternRenderingRectangle = createRect();

  private readonly pattern = createPattern();

  private readonly patternContent = createContent();

  private readonly tileWidth = 25;

  private readonly tileHeight = 25;

  private readonly tileDx = this.tileWidth / 2;

  private readonly tileDy = this.tileHeight / 2;

  private readonly resizeObserver = new ResizeObserver((entries) => {
    const entry = entries[0];
    const { width, height } = entry.contentRect;

    this.svg.setAttribute("width", `${width}`);
    this.svg.setAttribute("height", `${height}`);

    this.patternRenderingRectangle.setAttribute("width", `${width}`);
    this.patternRenderingRectangle.setAttribute("height", `${height}`);

    const patternWidth = this.tileWidth / width;
    const patternHeight = this.tileHeight / height;

    this.pattern.setAttribute("width", `${patternWidth}`);
    this.pattern.setAttribute("height", `${patternHeight}`);
  });

  private readonly onAfterTransformUpdated = (): void => {
    const m = this.canvas.viewport.getContentMatrix();
    const x = m.x - this.tileDx * m.scale;
    const y = m.y - this.tileDy * m.scale;
    const transform = `matrix(${m.scale}, 0, 0, ${m.scale}, ${x}, ${y})`;

    this.pattern.setAttribute("patternTransform", transform);
  };

  private readonly onBeforeDestroy = (): void => {
    this.resizeObserver.unobserve(this.host);
    this.host.removeChild(this.svg);
    this.canvas.viewport.onAfterUpdated.unsubscribe(
      this.onAfterTransformUpdated,
    );
    this.canvas.onBeforeDestroy.unsubscribe(this.onBeforeDestroy);
  };

  private constructor(
    private readonly canvas: Canvas,
    private readonly host: HTMLElement,
  ) {
    const transform = `translate(${this.tileDx}, ${this.tileDy})`;
    this.patternContent.setAttribute("transform", transform);

    this.pattern.appendChild(this.patternContent);

    const defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
    defs.appendChild(this.pattern);

    this.svg.appendChild(defs);
    this.svg.appendChild(this.patternRenderingRectangle);

    this.host.appendChild(this.svg);
    this.resizeObserver.observe(this.host);

    this.canvas.viewport.onAfterUpdated.subscribe(this.onAfterTransformUpdated);
    this.canvas.onBeforeDestroy.subscribe(this.onBeforeDestroy);
  }

  public static configure(canvas: Canvas, host: HTMLElement): void {
    new BackgroundConfigurator(canvas, host);
  }
}
