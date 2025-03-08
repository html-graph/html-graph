import {
  Canvas,
  CanvasCore,
  CoreOptions,
  UserDraggableNodesCanvas,
  DragOptions,
  UserTransformableViewportCanvas,
  TransformOptions,
  ResizeReactiveNodesCanvas,
  VirtualScrollCanvas,
  RenderingBox,
} from "@/canvas";
import { EventSubject } from "./event-subject";

export class CanvasBuilder {
  private coreOptions: CoreOptions | undefined = undefined;

  private dragOptions: DragOptions | undefined = undefined;

  private transformOptions: TransformOptions | undefined = undefined;

  private virtualScrollTrigger = new EventSubject<RenderingBox>();

  private isDraggable = false;

  private isTransformable = false;

  private hasResizeReactiveNodes = false;

  private hasVirtualScroll = false;

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

  public setVirtualScroll(trigger: EventSubject<RenderingBox>): CanvasBuilder {
    this.hasVirtualScroll = true;
    this.virtualScrollTrigger = trigger;

    return this;
  }

  public build(): Canvas {
    let res: Canvas = new CanvasCore(this.coreOptions);

    if (this.isDraggable) {
      res = new UserDraggableNodesCanvas(res, this.dragOptions);
    }

    if (this.isTransformable) {
      res = new UserTransformableViewportCanvas(res, this.transformOptions);
    }

    if (this.hasResizeReactiveNodes) {
      res = new ResizeReactiveNodesCanvas(res);
    }

    if (this.hasVirtualScroll) {
      res = new VirtualScrollCanvas(res, this.virtualScrollTrigger);
    }

    return res;
  }
}
