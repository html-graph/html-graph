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
  ViewportHtmlView,
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

  private viewportRenderTrigger: EventSubject<ViewportBox> | null = null;

  /**
   * specifies options for fundamental aspects of visualization
   */
  public setOptions(options: CoreOptions): CanvasBuilder {
    this.coreOptions = options;

    return this;
  }

  /**
   * enables nodes draggable bu user
   */
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

  /**
   * enables viewport transformable by user
   */
  public setUserTransformableViewport(
    options?: TransformOptions,
  ): CanvasBuilder {
    this.hasTransformableViewport = true;
    this.transformOptions = options;

    return this;
  }

  /**
   * enables automatic edges update on node resize
   */
  public setResizeReactiveNodes(): CanvasBuilder {
    this.hasResizeReactiveNodes = true;

    return this;
  }

  /**
   * sets emitter for rendering graph inside bounded area
   */
  public setViewportRenderTrigger(
    trigger: EventSubject<ViewportBox>,
  ): CanvasBuilder {
    this.viewportRenderTrigger = trigger;

    return this;
  }

  /**
   * builds final canvas
   */
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
    if (this.viewportRenderTrigger !== null) {
      const trigger = this.viewportRenderTrigger;

      return (
        graphStore: GraphStore,
        viewportTransformer: ViewportTransformer,
      ): HtmlView => {
        return new ViewportHtmlView(
          new CoreHtmlView(graphStore, viewportTransformer),
          graphStore,
          trigger,
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
