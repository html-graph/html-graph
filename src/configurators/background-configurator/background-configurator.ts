import { Canvas } from "@/canvas";
import {
  createPattern,
  createPatternFilledRectangle,
  createSvg,
} from "./utils";
import { BackgroundParams } from "./background-params";

// Responsibility: Configures background rendering behind graph
export class BackgroundConfigurator {
  private readonly svg = createSvg();

  private readonly patternRenderingRectangle = createPatternFilledRectangle();

  private readonly pattern = createPattern();

  private readonly patternContent: SVGElement;

  private readonly tileWidth: number;

  private readonly tileHeight: number;

  private readonly halfTileWidth: number;

  private readonly halfTileHeight: number;

  private readonly maxViewportScale: number;

  private visible = false;

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
    const x = m.x - this.halfTileWidth * m.scale;
    const y = m.y - this.halfTileHeight * m.scale;
    const transform = `matrix(${m.scale}, 0, 0, ${m.scale}, ${x}, ${y})`;

    this.pattern.setAttribute("patternTransform", transform);

    this.updateVisibility();
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
    params: BackgroundParams,
    private readonly host: HTMLElement,
  ) {
    this.tileWidth = params.tileWidth;
    this.tileHeight = params.tileHeight;
    this.halfTileWidth = this.tileWidth / 2;
    this.halfTileHeight = this.tileHeight / 2;
    this.patternContent = params.renderer;
    this.maxViewportScale = params.maxViewportScale;

    const transform = `translate(${this.halfTileWidth}, ${this.halfTileHeight})`;
    this.patternContent.setAttribute("transform", transform);

    this.pattern.appendChild(this.patternContent);

    const defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
    defs.appendChild(this.pattern);

    this.svg.appendChild(defs);
    this.svg.appendChild(this.patternRenderingRectangle);

    this.resizeObserver.observe(this.host);

    this.canvas.viewport.onAfterUpdated.subscribe(this.onAfterTransformUpdated);
    this.onAfterTransformUpdated();

    this.canvas.onBeforeDestroy.subscribe(this.onBeforeDestroy);
  }

  public static configure(
    canvas: Canvas,
    config: BackgroundParams,
    host: HTMLElement,
  ): void {
    new BackgroundConfigurator(canvas, config, host);
  }

  private updateVisibility(): void {
    const viewportScale = this.canvas.viewport.getViewportMatrix().scale;
    const scaleReached = viewportScale > this.maxViewportScale;

    if (scaleReached && this.visible) {
      this.visible = false;
      this.host.removeChild(this.svg);
    } else if (!scaleReached && !this.visible) {
      this.visible = true;
      this.host.appendChild(this.svg);
    }
  }
}
