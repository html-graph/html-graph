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
  coreHtmlViewFactory,
  createBoxHtmlViewFactory,
  TransformVirtualScrollCanvas,
  hookTransformOptions,
  VirtualScrollOptions,
} from "./canvas";
import { RenderingBox } from "./html-view";
import { EventSubject } from "./event-subject";

export class CanvasBuilder {
  private coreOptions: CoreOptions = {};

  private dragOptions: DragOptions | undefined = undefined;

  private transformOptions: TransformOptions | undefined = undefined;

  private virtualScrollOptions: VirtualScrollOptions | undefined = undefined;

  private hasDraggableNode = false;

  private hasTransformableViewport = false;

  private hasResizeReactiveNodes = false;

  private boxRenderingTrigger: EventSubject<RenderingBox> | undefined =
    undefined;

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
  public setBoxRenderingTrigger(
    trigger: EventSubject<RenderingBox>,
  ): CanvasBuilder {
    this.boxRenderingTrigger = trigger;

    return this;
  }

  public setTransformVirtualScroll(
    options: VirtualScrollOptions,
  ): CanvasBuilder {
    this.virtualScrollOptions = options;

    return this;
  }

  /**
   * builds final canvas
   */
  public build(): Canvas {
    const htmlViewFactory =
      this.boxRenderingTrigger !== undefined
        ? createBoxHtmlViewFactory(this.boxRenderingTrigger)
        : coreHtmlViewFactory;

    const container = new DiContainer(this.coreOptions, htmlViewFactory);

    let canvas: Canvas = new CoreCanvas(container);

    if (this.hasResizeReactiveNodes) {
      canvas = new ResizeReactiveNodesCanvas(canvas);
    }

    if (this.hasDraggableNode) {
      canvas = new UserDraggableNodesCanvas(canvas, this.dragOptions);
    }

    if (this.hasTransformableViewport) {
      let transformOptions: TransformOptions | undefined =
        this.transformOptions;
      const trigger =
        this.boxRenderingTrigger ?? new EventSubject<RenderingBox>();

      if (this.virtualScrollOptions !== undefined) {
        transformOptions = hookTransformOptions(transformOptions, trigger);
      }

      canvas = new UserTransformableViewportCanvas(canvas, transformOptions);

      if (this.virtualScrollOptions !== undefined) {
        canvas = new TransformVirtualScrollCanvas(
          canvas,
          trigger,
          this.virtualScrollOptions,
        );
      }
    }

    return canvas;
  }
}
