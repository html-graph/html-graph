import { Canvas } from "@/canvas";
import { EventSubject } from "@/event-subject";
import { RenderingBox } from "@/html-view";
import {
  TransformOptions,
  UserTransformableViewportConfigurator,
} from "../user-transformable-viewport-configurator";
import { VirtualScrollOptions } from "./virtual-scroll-options";
import { TransformState } from "@/viewport-store";
import { Viewport } from "@/viewport";

export class UserTransformableViewportVirtualScrollConfigurator {
  private readonly canvasResizeObserver: ResizeObserver;

  private readonly window = window;

  private readonly nodeHorizontal: number;

  private readonly nodeVertical: number;

  private readonly viewport: Viewport;

  private readonly element: HTMLElement;

  private viewportWidth = 0;

  private viewportHeight = 0;

  private viewportMatrix: TransformState;

  private loadedArea: {
    readonly xFrom: number;
    readonly xTo: number;
    readonly yFrom: number;
    readonly yTo: number;
  } = {
    xFrom: Infinity,
    xTo: Infinity,
    yFrom: Infinity,
    yTo: Infinity,
  };

  private readonly updateLoadedArea = (renderingBox: RenderingBox): void => {
    this.loadedArea = {
      xFrom: renderingBox.x,
      xTo: renderingBox.x + renderingBox.width,
      yFrom: renderingBox.y,
      yTo: renderingBox.y + renderingBox.height,
    };
  };

  private readonly onBeforeDestroy = (): void => {
    this.trigger.unsubscribe(this.updateLoadedArea);
    this.canvasResizeObserver.unobserve(this.element);
    this.canvas.onBeforeDestroy.unsubscribe(this.onBeforeDestroy);
  };

  public constructor(
    private readonly canvas: Canvas,
    transformOptions: TransformOptions | undefined,
    private readonly trigger: EventSubject<RenderingBox>,
    private readonly virtualScrollOptions: VirtualScrollOptions,
  ) {
    this.nodeHorizontal =
      this.virtualScrollOptions.nodeContainingRadius.horizontal;
    this.nodeVertical = this.virtualScrollOptions.nodeContainingRadius.vertical;
    this.canvasResizeObserver = new this.window.ResizeObserver((entries) => {
      const entry = entries[0];
      this.viewportWidth = entry.contentRect.width;
      this.viewportHeight = entry.contentRect.height;
      this.scheduleLoadAreaAroundViewport();
    });
    this.viewport = canvas.viewport;
    this.element = canvas.element;

    const onTransformFinished =
      transformOptions?.events?.onTransformFinished ?? ((): void => {});
    const onTransformChange =
      transformOptions?.events?.onTransformChange ?? ((): void => {});

    const patchedTransformOptions: TransformOptions = {
      ...transformOptions,
      events: {
        ...transformOptions?.events,
        onTransformChange: () => {
          const viewportMatrix = this.viewportMatrix;
          this.viewportMatrix = this.viewport.getViewportMatrix();
          if (viewportMatrix.scale !== this.viewportMatrix.scale) {
            this.scheduleEnsureViewportAreaLoaded();
          }
          onTransformChange();
        },
        onTransformFinished: () => {
          this.scheduleLoadAreaAroundViewport();
          onTransformFinished();
        },
      },
    };

    UserTransformableViewportConfigurator.configure(
      canvas,
      patchedTransformOptions,
    );

    this.viewportMatrix = this.viewport.getViewportMatrix();
    this.trigger.subscribe(this.updateLoadedArea);
    this.canvasResizeObserver.observe(this.element);

    this.canvas.onBeforeDestroy.subscribe(this.onBeforeDestroy);
  }

  public static configure(
    canvas: Canvas,
    transformOptions: TransformOptions,
    trigger: EventSubject<RenderingBox>,
    virtualScrollOptions: VirtualScrollOptions,
  ): void {
    new UserTransformableViewportVirtualScrollConfigurator(
      canvas,
      transformOptions,
      trigger,
      virtualScrollOptions,
    );
  }

  private scheduleLoadAreaAroundViewport(): void {
    setTimeout(() => {
      this.loadAreaAroundViewport();
    });
  }
  private scheduleEnsureViewportAreaLoaded(): void {
    const absoluteViewportWidth =
      this.viewportWidth * this.viewportMatrix.scale;
    const absoluteViewportHeight =
      this.viewportHeight * this.viewportMatrix.scale;
    const xViewportFrom = this.viewportMatrix.x - this.nodeHorizontal;
    const yViewportFrom = this.viewportMatrix.y - this.nodeVertical;
    const xViewportTo =
      this.viewportMatrix.x + absoluteViewportWidth + this.nodeHorizontal;
    const yViewportTo =
      this.viewportMatrix.y + absoluteViewportHeight + this.nodeVertical;
    const isLoaded =
      this.loadedArea.xFrom < xViewportFrom &&
      this.loadedArea.xTo > xViewportTo &&
      this.loadedArea.yFrom < yViewportFrom &&
      this.loadedArea.yTo > yViewportTo;
    if (!isLoaded) {
      this.scheduleLoadAreaAroundViewport();
    }
  }

  private loadAreaAroundViewport(): void {
    const absoluteViewportWidth =
      this.viewportWidth * this.viewportMatrix.scale;
    const absoluteViewportHeight =
      this.viewportHeight * this.viewportMatrix.scale;
    const x =
      this.viewportMatrix.x - absoluteViewportWidth - this.nodeHorizontal;
    const y =
      this.viewportMatrix.y - absoluteViewportHeight - this.nodeVertical;
    const width = 3 * absoluteViewportWidth + 2 * this.nodeHorizontal;
    const height = 3 * absoluteViewportHeight + 2 * this.nodeVertical;
    this.trigger.emit({ x, y, width, height });
  }
}
