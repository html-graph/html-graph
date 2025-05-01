import { Canvas } from "@/canvas";
import { createContent, createPattern, createRect, createSvg } from "./utils";

/**
 * Responsibility: Configures background rendering behind graph
 */
export class BackgroundConfigurator {
  private readonly svg = createSvg();

  private readonly rect = createRect();

  private readonly pattern = createPattern();

  private readonly content = createContent();

  private currentWidth = 0;

  private currentHeight = 0;

  private readonly tileWidth = 25;

  private readonly tileHeight = 25;

  private readonly tileDx = this.tileWidth / 2;

  private readonly tileDy = this.tileHeight / 2;

  private readonly resizeObserver = new ResizeObserver((entries) => {
    const entry = entries[0];
    const { width, height } = entry.contentRect;

    this.svg.setAttribute("width", `${width}`);
    this.svg.setAttribute("height", `${height}`);

    this.rect.setAttribute("width", `${width}`);
    this.rect.setAttribute("height", `${height}`);

    this.currentWidth = width;
    this.currentHeight = height;

    const patternWidth = this.tileWidth / this.currentWidth;
    const patternHeight = this.tileHeight / this.currentHeight;

    this.pattern.setAttribute("width", `${patternWidth}`);
    this.pattern.setAttribute("height", `${patternHeight}`);
  });

  private readonly onAfterTransformUpdated = (): void => {
    const m = this.canvas.viewport.getContentMatrix();
    const dx = this.tileDx * m.scale;
    const dy = this.tileDy * m.scale;
    const x = m.x - dx;
    const y = m.y - dy;
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
    const translate = `translate(${this.tileDx}, ${this.tileDy})`;
    this.content.setAttribute("transform", translate);

    this.pattern.appendChild(this.content);

    const defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
    defs.appendChild(this.pattern);

    this.svg.appendChild(defs);
    this.svg.appendChild(this.rect);

    this.host.prepend(this.svg);
    this.resizeObserver.observe(this.host);

    this.canvas.viewport.onAfterUpdated.subscribe(this.onAfterTransformUpdated);
    this.canvas.onBeforeDestroy.subscribe(this.onBeforeDestroy);
  }

  public static configure(canvas: Canvas, host: HTMLElement): void {
    new BackgroundConfigurator(canvas, host);
  }
}
