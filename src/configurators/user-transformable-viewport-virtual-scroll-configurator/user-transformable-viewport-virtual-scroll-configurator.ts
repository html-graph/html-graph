import { Canvas } from "@/canvas";
import { EventSubject } from "@/event-subject";
import { RenderingBox } from "@/html-view";
import {
  TransformableViewportParams,
  UserTransformableViewportConfigurator,
} from "../user-transformable-viewport-configurator";
import { VirtualScrollParams } from "./virtual-scroll-config";
import { Viewport } from "@/viewport";

export class UserTransformableViewportVirtualScrollConfigurator {
  private readonly nodeHorizontal: number;

  private readonly nodeVertical: number;

  private readonly viewport: Viewport;

  private currentScale: number;

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

  private readonly onAfterViewportUpdated = (): void => {
    if (!this.userTransformInProgress) {
      this.loadAreaAroundViewport();
    }
  };

  private userTransformInProgress = false;

  public constructor(
    private readonly canvas: Canvas,
    private readonly element: HTMLElement,
    private readonly window: Window,
    transformParams: TransformableViewportParams,
    private readonly trigger: EventSubject<RenderingBox>,
    private readonly params: VirtualScrollParams,
  ) {
    this.nodeHorizontal = this.params.nodeVerticalRadius;
    this.nodeVertical = this.params.nodeHorizontalRadius;

    this.viewport = canvas.viewport;

    this.currentScale = this.viewport.getViewportMatrix().scale;
    this.scheduleLoadAreaAroundViewport();

    this.viewport.onAfterResize.subscribe(() => {
      this.scheduleLoadAreaAroundViewport();
    });

    const patchedTransformableViewportParams: TransformableViewportParams = {
      ...transformParams,
      onResizeTransformStarted: () => {
        this.userTransformInProgress = true;
        transformParams.onResizeTransformStarted();
      },
      onResizeTransformFinished: () => {
        this.userTransformInProgress = false;
        transformParams.onResizeTransformFinished();
      },
      onBeforeTransformChange: () => {
        this.userTransformInProgress = true;
        transformParams.onBeforeTransformChange();
      },
      onTransformChange: () => {
        this.userTransformInProgress = false;
        const previousScale = this.currentScale;
        this.currentScale = this.viewport.getViewportMatrix().scale;

        if (previousScale !== this.currentScale) {
          this.scheduleEnsureViewportAreaLoaded();
        }

        transformParams.onTransformChange();
      },
      onTransformFinished: () => {
        this.scheduleLoadAreaAroundViewport();
        transformParams.onTransformFinished();
      },
    };

    UserTransformableViewportConfigurator.configure(
      canvas,
      this.element,
      this.window,
      patchedTransformableViewportParams,
    );

    this.trigger.subscribe(this.updateLoadedArea);
    this.canvas.viewport.onAfterUpdated.subscribe(this.onAfterViewportUpdated);
  }

  public static configure(
    canvas: Canvas,
    element: HTMLElement,
    win: Window,
    transformParams: TransformableViewportParams,
    trigger: EventSubject<RenderingBox>,
    virtualScrollOptions: VirtualScrollParams,
  ): void {
    new UserTransformableViewportVirtualScrollConfigurator(
      canvas,
      element,
      win,
      transformParams,
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
    setTimeout(() => {
      const { width, height } = this.viewport.getDimensions();
      const { scale, x, y } = this.viewport.getViewportMatrix();

      const absoluteViewportWidth = width * scale;
      const absoluteViewportHeight = height * scale;
      const xViewportFrom = x - this.nodeHorizontal;
      const yViewportFrom = y - this.nodeVertical;
      const xViewportTo = x + absoluteViewportWidth + this.nodeHorizontal;
      const yViewportTo = y + absoluteViewportHeight + this.nodeVertical;

      const isLoaded =
        this.loadedArea.xFrom < xViewportFrom &&
        this.loadedArea.xTo > xViewportTo &&
        this.loadedArea.yFrom < yViewportFrom &&
        this.loadedArea.yTo > yViewportTo;

      if (!isLoaded) {
        this.loadAreaAroundViewport();
      }
    });
  }

  private loadAreaAroundViewport(): void {
    const { width, height } = this.viewport.getDimensions();
    const { scale, x, y } = this.viewport.getViewportMatrix();

    const absoluteViewportWidth = width * scale;
    const absoluteViewportHeight = height * scale;
    const totalX = x - absoluteViewportWidth - this.nodeHorizontal;
    const totalY = y - absoluteViewportHeight - this.nodeVertical;
    const totalWidth = 3 * absoluteViewportWidth + 2 * this.nodeHorizontal;
    const totalHeight = 3 * absoluteViewportHeight + 2 * this.nodeVertical;

    this.trigger.emit({
      x: totalX,
      y: totalY,
      width: totalWidth,
      height: totalHeight,
    });
  }
}
