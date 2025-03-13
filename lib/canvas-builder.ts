import {
  Canvas,
  CoreOptions,
  UserDraggableNodesCanvas,
  DragOptions,
  UserTransformableViewportCanvas,
  TransformOptions,
  ResizeReactiveNodesCanvas,
  CoreCanvas,
  DiContainer,
} from "@/canvas";
import {
  CoreHtmlController,
  HtmlController,
  ViewportBox,
  VirtualScrollHtmlController,
  VirtualScrollHtmlControllerConfig,
} from "./html-controller";
import { GraphStore } from "./graph-store";
import { ViewportTransformer } from "./viewport-transformer";
import { HtmlControllerFactory } from "./canvas/core-canvas";
import { VirtualScrollOptions } from "./virtual-scroll-options";
import { EventSubject } from "./event-subject";

export class CanvasBuilder {
  private coreOptions: CoreOptions = {};

  private dragOptions: DragOptions | undefined = undefined;

  private transformOptions: TransformOptions | undefined = undefined;

  private hasDraggableNode = false;

  private hasTransformableViewport = false;

  private hasResizeReactiveNodes = false;

  private virtualScrollOptions: VirtualScrollOptions | null = null;

  public setOptions(options: CoreOptions): CanvasBuilder {
    this.coreOptions = options;

    return this;
  }

  public setUserDraggableNodes(options?: DragOptions): CanvasBuilder {
    this.hasDraggableNode = true;
    this.dragOptions = options;

    return this;
  }

  /**
   * @deprecated
   * use setUserTransformableViewport instead
   */
  public setUserTransformableCanvas(options?: TransformOptions): CanvasBuilder {
    return this.setUserTransformableViewport(options);
  }

  public setUserTransformableViewport(
    options?: TransformOptions,
  ): CanvasBuilder {
    this.hasTransformableViewport = true;
    this.transformOptions = options;

    return this;
  }

  public setResizeReactiveNodes(): CanvasBuilder {
    this.hasResizeReactiveNodes = true;

    return this;
  }

  public setVirtualScroll(options: VirtualScrollOptions): CanvasBuilder {
    this.virtualScrollOptions = options;

    return this;
  }

  public build(): Canvas {
    const htmlControllerFactory = this.createHtmlControllerFactory();
    const container = new DiContainer(this.coreOptions, htmlControllerFactory);

    let canvas: Canvas = new CoreCanvas(container);

    if (this.hasResizeReactiveNodes) {
      canvas = new ResizeReactiveNodesCanvas(canvas);
    }

    if (this.hasDraggableNode) {
      canvas = new UserDraggableNodesCanvas(canvas, this.dragOptions);
    }

    if (this.hasTransformableViewport) {
      canvas = new UserTransformableViewportCanvas(
        canvas,
        this.transformOptions,
      );
    }

    return canvas;
  }

  private createHtmlControllerFactory(): HtmlControllerFactory {
    let factory: HtmlControllerFactory = (
      graphStore: GraphStore,
      viewportTransformer: ViewportTransformer,
    ): HtmlController => {
      return new CoreHtmlController(graphStore, viewportTransformer);
    };

    if (this.virtualScrollOptions !== null) {
      const options = this.virtualScrollOptions;

      factory = (
        graphStore: GraphStore,
        viewportTransformer: ViewportTransformer,
      ): HtmlController => {
        const params: VirtualScrollHtmlControllerConfig = {
          trigger: options.trigger ?? new EventSubject<ViewportBox>(),
        };

        return new VirtualScrollHtmlController(
          new CoreHtmlController(graphStore, viewportTransformer),
          graphStore,
          params,
        );
      };
    }

    return factory;
  }
}
