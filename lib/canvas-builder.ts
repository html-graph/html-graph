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

export class CanvasBuilder {
  private coreOptions: CoreOptions | undefined = undefined;

  private dragOptions: DragOptions | undefined = undefined;

  private transformOptions: TransformOptions | undefined = undefined;

  private isDraggable = false;

  private isTransformable = false;

  private hasResizeReactiveNodes = false;

  public setOptions(options: CoreOptions): CanvasBuilder {
    this.coreOptions = options;

    return this;
  }

  public setUserDraggableNodes(options?: DragOptions): CanvasBuilder {
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
  ): CanvasBuilder {
    return this.setUserTransformableViewport(options);
  }

  public setUserTransformableViewport(
    options?: TransformOptions,
  ): CanvasBuilder {
    this.isTransformable = true;
    this.transformOptions = options;

    return this;
  }

  public setResizeReactiveNodes(): CanvasBuilder {
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
