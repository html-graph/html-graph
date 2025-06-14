import { Canvas } from "@/canvas";
import { EventSubject } from "@/event-subject";
import { RenderingBox } from "@/html-view";
import {
  ViewportTransformConfig,
  UserTransformableViewportConfigurator,
} from "../user-transformable-viewport-configurator";
import { VirtualScrollConfig } from "./virtual-scroll-options";
import { TransformState } from "@/viewport-store";
import { Viewport } from "@/viewport";

/**
 * Responsibility: Configures canvas to have viewport transformable by user, while
 * rendering only entities near viewport
 */
export class UserTransformableViewportVirtualScrollConfigurator {
  private readonly canvasResizeObserver: ResizeObserver;

  private readonly nodeHorizontal: number;

  private readonly nodeVertical: number;

  private readonly viewport: Viewport;

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
    this.canvas.viewport.onAfterUpdated.unsubscribe(
      this.onAfterViewportUpdated,
    );
    this.canvas.onBeforeDestroy.unsubscribe(this.onBeforeDestroy);
  };

  private readonly onAfterViewportUpdated = (): void => {
    if (!this.userTransformInProgress) {
      this.viewportMatrix = this.viewport.getViewportMatrix();
      this.loadAreaAroundViewport();
    }
  };

  private userTransformInProgress = false;

  public constructor(
    private readonly canvas: Canvas,
    private readonly element: HTMLElement,
    private readonly window: Window,
    transformOptions: ViewportTransformConfig | undefined,
    private readonly trigger: EventSubject<RenderingBox>,
    private readonly virtualScrollOptions: VirtualScrollConfig,
  ) {
    this.nodeHorizontal =
      this.virtualScrollOptions.nodeContainingRadius.horizontal;
    this.nodeVertical = this.virtualScrollOptions.nodeContainingRadius.vertical;

    this.canvasResizeObserver = new ResizeObserver((entries) => {
      const entry = entries[0];
      this.viewportWidth = entry.contentRect.width;
      this.viewportHeight = entry.contentRect.height;
      this.scheduleLoadAreaAroundViewport();
    });

    this.viewport = canvas.viewport;

    const onResizeTransformStarted =
      transformOptions?.events?.onResizeTransformStarted ?? ((): void => {});
    const onResizeTransformFinished =
      transformOptions?.events?.onResizeTransformFinished ?? ((): void => {});
    const onTransformChange =
      transformOptions?.events?.onTransformChange ?? ((): void => {});
    const onBeforeTransformChange =
      transformOptions?.events?.onBeforeTransformChange ?? ((): void => {});
    const onTransformFinished =
      transformOptions?.events?.onTransformFinished ?? ((): void => {});

    const patchedViewportTransformConfig: ViewportTransformConfig = {
      ...transformOptions,
      events: {
        ...transformOptions?.events,
        onResizeTransformStarted: () => {
          this.userTransformInProgress = true;
          onResizeTransformStarted();
        },
        onResizeTransformFinished: () => {
          this.userTransformInProgress = false;
          onResizeTransformFinished();
        },
        onBeforeTransformChange: () => {
          this.userTransformInProgress = true;
          onBeforeTransformChange();
        },
        onTransformChange: () => {
          this.userTransformInProgress = false;
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
      this.element,
      this.window,
      patchedViewportTransformConfig,
    );

    this.viewportMatrix = this.viewport.getViewportMatrix();
    this.trigger.subscribe(this.updateLoadedArea);
    this.canvasResizeObserver.observe(this.element);
    this.canvas.viewport.onAfterUpdated.subscribe(this.onAfterViewportUpdated);

    this.canvas.onBeforeDestroy.subscribe(this.onBeforeDestroy);
  }

  public static configure(
    canvas: Canvas,
    element: HTMLElement,
    win: Window,
    transformOptions: ViewportTransformConfig,
    trigger: EventSubject<RenderingBox>,
    virtualScrollOptions: VirtualScrollConfig,
  ): void {
    new UserTransformableViewportVirtualScrollConfigurator(
      canvas,
      element,
      win,
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
