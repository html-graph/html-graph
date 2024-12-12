import {
  Canvas,
  CanvasCore,
  CoreOptions,
  DraggableNodesCanvas,
  DragOptions,
  TransformableCanvas,
  TransformOptions,
} from "@/canvas";

export class HtmlGraphBuilder {
  private coreOptions: CoreOptions | undefined = undefined;

  private dragOptions: DragOptions | undefined = undefined;

  private transformOptions: TransformOptions | undefined = undefined;

  private isDraggable = false;

  private isTransformable = false;

  public setOptions(options: CoreOptions): HtmlGraphBuilder {
    this.coreOptions = options;

    return this;
  }

  public setDraggableNodes(dragOptions?: DragOptions): HtmlGraphBuilder {
    this.isDraggable = true;
    this.dragOptions = dragOptions;

    return this;
  }

  public setTransformableCanvas(options?: TransformOptions): HtmlGraphBuilder {
    this.isTransformable = true;
    this.transformOptions = options;

    return this;
  }

  public build(): Canvas {
    let res: Canvas = new CanvasCore(this.coreOptions);

    if (this.isDraggable) {
      res = new DraggableNodesCanvas(res, this.dragOptions);
    }

    if (this.isTransformable) {
      res = new TransformableCanvas(res, this.transformOptions);
    }

    return res;
  }
}
