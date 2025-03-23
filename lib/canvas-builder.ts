import {
  CanvasController,
  CoreOptions,
  UserDraggableNodesCanvasController,
  DragOptions,
  UserTransformableViewportCanvasController,
  TransformOptions,
  ResizeReactiveNodesCanvasController,
  CoreCanvasController,
  coreHtmlViewFactory,
  createBoxHtmlViewFactory,
  UserTransformableViewportVirtualScrollCanvasController,
  VirtualScrollOptions,
} from "./canvas-controller";
import { RenderingBox } from "./html-view";
import { EventSubject } from "./event-subject";
import { Canvas } from "./canvas";
import { createDefaults } from "./canvas-controller/core-canvas-controller/options";

export class CanvasBuilder {
  private coreOptions: CoreOptions = {};

  private dragOptions: DragOptions | undefined = undefined;

  private transformOptions: TransformOptions | undefined = undefined;

  private virtualScrollOptions: VirtualScrollOptions | undefined = undefined;

  private hasDraggableNode = false;

  private hasTransformableViewport = false;

  private hasResizeReactiveNodes = false;

  private boxRenderingTrigger: EventSubject<RenderingBox> | undefined =
    undefined;

  /**
   * specifies options for fundamental aspects of visualization
   */
  public setOptions(options: CoreOptions): CanvasBuilder {
    this.coreOptions = options;

    return this;
  }

  /**
   * enables nodes draggable bu user
   */
  public enableUserDraggableNodes(options?: DragOptions): CanvasBuilder {
    this.hasDraggableNode = true;
    this.dragOptions = options;

    return this;
  }

  /**
   * enables viewport transformable by user
   */
  public enableUserTransformableViewport(
    options?: TransformOptions,
  ): CanvasBuilder {
    this.hasTransformableViewport = true;
    this.transformOptions = options;

    return this;
  }

  /**
   * enables automatic edges update on node resize
   */
  public enableResizeReactiveNodes(): CanvasBuilder {
    this.hasResizeReactiveNodes = true;

    return this;
  }

  /**
   * sets emitter for rendering graph inside bounded area
   */
  public enableBoxAreaRendering(
    trigger: EventSubject<RenderingBox>,
  ): CanvasBuilder {
    this.boxRenderingTrigger = trigger;

    return this;
  }

  public enableVirtualScroll(options: VirtualScrollOptions): CanvasBuilder {
    this.virtualScrollOptions = options;

    return this;
  }

  /**
   * builds final canvas
   */
  public build(): Canvas {
    let trigger = this.boxRenderingTrigger;

    if (this.virtualScrollOptions !== undefined && trigger === undefined) {
      trigger = new EventSubject<RenderingBox>();
    }

    const htmlViewFactory =
      trigger !== undefined
        ? createBoxHtmlViewFactory(trigger)
        : coreHtmlViewFactory;

    let controller: CanvasController = new CoreCanvasController(
      htmlViewFactory,
    );

    if (this.hasResizeReactiveNodes) {
      controller = new ResizeReactiveNodesCanvasController(controller);
    }

    if (this.hasDraggableNode) {
      controller = new UserDraggableNodesCanvasController(
        controller,
        this.dragOptions,
      );
    }

    if (this.virtualScrollOptions !== undefined) {
      controller = new UserTransformableViewportVirtualScrollCanvasController(
        controller,
        trigger!,
        this.transformOptions,
        this.virtualScrollOptions,
      );
    } else if (this.hasTransformableViewport) {
      controller = new UserTransformableViewportCanvasController(
        controller,
        this.transformOptions,
      );
    }

    const canvas = new Canvas(controller, createDefaults(this.coreOptions));

    this.reset();

    return canvas;
  }

  private reset(): void {
    this.coreOptions = {};
    this.dragOptions = undefined;
    this.transformOptions = undefined;
    this.virtualScrollOptions = undefined;
    this.hasDraggableNode = false;
    this.hasTransformableViewport = false;
    this.hasResizeReactiveNodes = false;
    this.boxRenderingTrigger = undefined;
  }
}
