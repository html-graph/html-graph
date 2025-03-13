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
  CoreHtmlView,
  HtmlView,
  ViewportBox,
  VirtualScrollHtmlView,
} from "./html-view";
import { GraphStore } from "./graph-store";
import { ViewportTransformer } from "./viewport-transformer";
import { HtmlViewFactory } from "./canvas/core-canvas";
import { EventSubject } from "./event-subject";

export class CanvasBuilder {
  private coreOptions: CoreOptions = {};

  private dragOptions: DragOptions | undefined = undefined;

  private transformOptions: TransformOptions | undefined = undefined;

  private hasDraggableNode = false;

  private hasTransformableViewport = false;

  private hasResizeReactiveNodes = false;

  private hasVirtualScroll = false;

  private virtualScrollTrigger = new EventSubject<ViewportBox>();

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
      this.virtualScrollTrigger = trigger;
    }

    return this;
  }

  public build(): Canvas {
    const htmlViewFactory = this.createHtmlViewFactory();
    const container = new DiContainer(this.coreOptions, htmlViewFactory);

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

  private createHtmlViewFactory(): HtmlViewFactory {
    if (this.hasVirtualScroll) {
      return (
        graphStore: GraphStore,
        viewportTransformer: ViewportTransformer,
      ): HtmlView => {
        return new VirtualScrollHtmlView(
          new CoreHtmlView(graphStore, viewportTransformer),
          graphStore,
          this.virtualScrollTrigger,
        );
      };
    }

    return (
      graphStore: GraphStore,
      viewportTransformer: ViewportTransformer,
    ): HtmlView => {
      return new CoreHtmlView(graphStore, viewportTransformer);
    };
  }
}
