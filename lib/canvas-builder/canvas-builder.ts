import { Canvas } from "../canvas/canvas";
import {
  CanvasCore,
  DraggableNodesCanvas,
  TransformableCanvas,
  TransformOptions,
} from "../main";
import { CoreOptions } from "../models/options/core-options";

export class CanvasBuilder {
  private coreOptions: CoreOptions | undefined = undefined;

  private transformOptions: TransformOptions | undefined = undefined;

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

  transformableCanvas(options?: TransformOptions): CanvasBuilder {
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
