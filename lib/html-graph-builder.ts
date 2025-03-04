import {
  Canvas,
  CanvasCore,
  CoreOptions,
  UserDraggableNodesCanvas,
  DragOptions,
  UserTransformableViewportCanvas,
  TransformOptions,
  ResizeReactiveNodesCanvas,
} from "@/canvas";

export class HtmlGraphBuilder {
  private coreOptions: CoreOptions | undefined = undefined;

  private dragOptions: DragOptions | undefined = undefined;

  private transformOptions: TransformOptions | undefined = undefined;

  private isDraggable = false;

  private isTransformable = false;

  private hasResizeReactiveNodes = false;

  public setOptions(options: CoreOptions): HtmlGraphBuilder {
    this.coreOptions = options;

    return this;
  }

  public setUserDraggableNodes(options?: DragOptions): HtmlGraphBuilder {
    this.isDraggable = true;
    this.dragOptions = options;

    return this;
  }

  /**
   * @deprecated
   * use setUserTransformableViewport instead
   */
  public setUserTransformableViewportCanvas(
    options?: TransformOptions,
  ): HtmlGraphBuilder {
    return this.setUserTransformableViewport(options);
  }

  public setUserTransformableViewport(
    options?: TransformOptions,
  ): HtmlGraphBuilder {
    this.isTransformable = true;
    this.transformOptions = options;

    return this;
  }

  public setResizeReactiveNodes(): HtmlGraphBuilder {
    this.hasResizeReactiveNodes = true;

    return this;
  }

  public build(): Canvas {
    let res: Canvas = new CanvasCore(this.coreOptions);

    if (this.hasResizeReactiveNodes) {
      res = new ResizeReactiveNodesCanvas(res);
    }

    if (this.isDraggable) {
      res = new UserDraggableNodesCanvas(res, this.dragOptions);
    }

    if (this.isTransformable) {
      res = new UserTransformableViewportCanvas(res, this.transformOptions);
    }

    return res;
  }
}
