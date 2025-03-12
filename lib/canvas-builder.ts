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
} from "./html-controller";
import { GraphStore } from "./graph-store";
import { ViewportTransformer } from "./viewport-transformer";
import { EventSubject } from "./event-subject";

export class CanvasBuilder {
  private coreOptions: CoreOptions = {};

  private dragOptions: DragOptions | undefined = undefined;

  private transformOptions: TransformOptions | undefined = undefined;

  private hasDraggableNode = false;

  private hasTransformableViewport = false;

  private hasResizeReactiveNodes = false;

  private hasVirtualScroll = false;

  private trigger = new EventSubject<ViewportBox>();

  private readonly coreHtmlControllerFactory = (
    graphStore: GraphStore,
    viewportTransformer: ViewportTransformer,
  ): HtmlController => new CoreHtmlController(graphStore, viewportTransformer);

  private readonly virtualScrollHtmlControllerFactory = (
    graphStore: GraphStore,
    viewportTransformer: ViewportTransformer,
  ): HtmlController =>
    new VirtualScrollHtmlController(
      this.coreHtmlControllerFactory(graphStore, viewportTransformer),
      this.trigger,
    );

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

  public setVirtualScroll(trigger?: EventSubject<ViewportBox>): CanvasBuilder {
    this.hasVirtualScroll = true;
    if (trigger !== undefined) {
      this.trigger = trigger;
    }

    return this;
  }

  public build(): Canvas {
    const htmlControllerFactory = this.hasVirtualScroll
      ? this.virtualScrollHtmlControllerFactory
      : this.coreHtmlControllerFactory;

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
}
