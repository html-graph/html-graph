import { Canvas } from "../canvas/canvas";
import { CanvasCore, DraggableNodesCanvas, TransformableCanvas } from "../main";
import { ApiOptions } from "../models/options/api-options";

export class CanvasBuilder {
  private coreOptions: ApiOptions | undefined = undefined;

  private isDraggable = false;

  private isTransformable = false;

  options(options: ApiOptions): CanvasBuilder {
    this.coreOptions = options;

    return this;
  }

  draggable(): CanvasBuilder {
    this.isDraggable = true;

    return this;
  }

  transformable(): CanvasBuilder {
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
