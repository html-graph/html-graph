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
  public setUserTransformableCanvas(options?: TransformOptions): CanvasBuilder {
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
    const diContainer = new DiContainer(this.coreOptions ?? {});
    let canvas: Canvas = new CoreCanvas(diContainer);

    if (this.hasResizeReactiveNodes) {
      canvas = new ResizeReactiveNodesCanvas(canvas);
    }

    if (this.isDraggable) {
      canvas = new UserDraggableNodesCanvas(canvas, this.dragOptions);
    }

    if (this.isTransformable) {
      canvas = new UserTransformableViewportCanvas(
        canvas,
        this.transformOptions,
      );
    }

    return canvas;
  }
}
