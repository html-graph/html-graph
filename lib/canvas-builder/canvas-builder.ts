import { Canvas } from "../canvas/canvas";
import { CanvasCore, DraggableNodesCanvas, TransformableCanvas } from "../main";
import { CoreOptions } from "../models/options/core-options";

export class CanvasBuilder {
  private coreOptions: CoreOptions | undefined = undefined;

  private isDraggable = false;

  private isTransformable = false;

  options(options: CoreOptions): CanvasBuilder {
    this.coreOptions = options;

    return this;
  }

  draggableNodes(): CanvasBuilder {
    this.isDraggable = true;

    return this;
  }

  transformableCanvas(): CanvasBuilder {
    this.isTransformable = true;

    return this;
  }

  build(): Canvas {
    let res: Canvas = new CanvasCore(this.coreOptions);

    if (this.isDraggable) {
      res = new DraggableNodesCanvas(res);
    }

    if (this.isTransformable) {
      res = new TransformableCanvas(res);
    }

    return res;
  }
}
