import { Canvas } from "@/canvas";
import { EventSubject } from "@/event-subject";
import { RenderingBox } from "@/html-view";
import {
  TransformableViewportParams,
  UserTransformableViewportConfigurator,
} from "../user-transformable-viewport-configurator";
import { VirtualScrollParams } from "./virtual-scroll-config";
import { TransformState } from "@/viewport-store";
import { Viewport } from "@/viewport";

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
    transformParams: TransformableViewportParams,
    private readonly trigger: EventSubject<RenderingBox>,
    private readonly params: VirtualScrollParams,
  ) {
    this.nodeHorizontal = this.params.nodeVerticalRadius;
    this.nodeVertical = this.params.nodeHorizontalRadius;

    this.canvasResizeObserver = new ResizeObserver((entries) => {
      const entry = entries[0];
      this.viewportWidth = entry.contentRect.width;
      this.viewportHeight = entry.contentRect.height;
      this.scheduleLoadAreaAroundViewport();
    });

    this.viewport = canvas.viewport;

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
        const viewportMatrix = this.viewportMatrix;
        this.viewportMatrix = this.viewport.getViewportMatrix();

        if (viewportMatrix.scale !== this.viewportMatrix.scale) {
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

    this.viewportMatrix = this.viewport.getViewportMatrix();
    this.trigger.subscribe(this.updateLoadedArea);
    this.canvasResizeObserver.observe(this.element);
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
