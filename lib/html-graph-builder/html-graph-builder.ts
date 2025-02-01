import {
  Canvas,
  CanvasCore,
  CoreOptions,
  UserDraggableNodesCanvas,
  DragOptions,
  UserTransformableCanvas,
  TransformOptions,
  ReactiveCanvas,
  ReactiveOptions,
} from "@/canvas";

export class HtmlGraphBuilder {
  private coreOptions: CoreOptions | undefined = undefined;

  private dragOptions: DragOptions | undefined = undefined;

  private transformOptions: TransformOptions | undefined = undefined;

  private isDraggable = false;

  private isTransformable = false;

  private reactiveOptions: ReactiveOptions | undefined = {
    nodeReactiveStrategy: "resize",
  };

  public setOptions(options: CoreOptions): HtmlGraphBuilder {
    this.coreOptions = options;

    return this;
  }

  public setUserDraggableNodes(options?: DragOptions): HtmlGraphBuilder {
    this.isDraggable = true;
    this.dragOptions = options;

    return this;
  }

  public setUserTransformableCanvas(
    options?: TransformOptions,
  ): HtmlGraphBuilder {
    this.isTransformable = true;
    this.transformOptions = options;

    return this;
  }

  public setReactiveOptions(options?: ReactiveOptions): HtmlGraphBuilder {
    this.reactiveOptions = options;

    return this;
  }

  public build(): Canvas {
    let res: Canvas = new CanvasCore(this.coreOptions);

    if (this.reactiveOptions?.nodeReactiveStrategy === "resize") {
      res = new ReactiveCanvas(res, this.reactiveOptions);
    }

    if (this.isDraggable) {
      res = new UserDraggableNodesCanvas(res, this.dragOptions);
    }

    if (this.isTransformable) {
      res = new UserTransformableCanvas(res, this.transformOptions);
    }

    return res;
  }
}
