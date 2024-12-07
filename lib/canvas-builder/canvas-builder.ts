import {
  Canvas,
  CanvasCore,
  CoreOptions,
  DraggableNodesCanvas,
  TransformableCanvas,
  TransformOptions,
} from "@/canvas";

export class CanvasBuilder {
  private coreOptions: CoreOptions | undefined = undefined;

  private transformOptions: TransformOptions | undefined = undefined;

  private isDraggable = false;

  private isTransformable = false;

  setOptions(options: CoreOptions): CanvasBuilder {
    this.coreOptions = options;

    return this;
  }

  setDraggableNodes(): CanvasBuilder {
    this.isDraggable = true;

    return this;
  }

  setTransformableCanvas(options?: TransformOptions): CanvasBuilder {
    this.isTransformable = true;
    this.transformOptions = options;

    return this;
  }

  build(): Canvas {
    let res: Canvas = new CanvasCore(this.coreOptions);

    if (this.isDraggable) {
      res = new DraggableNodesCanvas(res);
    }

    if (this.isTransformable) {
      res = new TransformableCanvas(res, this.transformOptions);
    }

    return res;
  }
}
