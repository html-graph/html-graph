import {
  CanvasController,
  CoreOptions,
  UserDraggableNodesCanvasController,
  DragOptions,
  UserTransformableViewportCanvasController,
  TransformOptions,
  ResizeReactiveNodesCanvasController,
  CoreCanvasController,
  DiContainer,
  coreHtmlViewFactory,
  createBoxHtmlViewFactory,
  UserTransformableViewportVirtualScrollCanvasController,
  VirtualScrollOptions,
} from "./canvas-controller";
import { RenderingBox } from "./html-view";
import { EventSubject } from "./event-subject";
import { Canvas } from "./canvas";

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

    const container = new DiContainer(this.coreOptions, htmlViewFactory);

    let canvasController: CanvasController = new CoreCanvasController(
      container,
    );

    if (this.hasResizeReactiveNodes) {
      canvasController = new ResizeReactiveNodesCanvasController(
        canvasController,
      );
    }

    if (this.hasDraggableNode) {
      canvasController = new UserDraggableNodesCanvasController(
        canvasController,
        this.dragOptions,
      );
    }

    if (this.virtualScrollOptions !== undefined) {
      canvasController =
        new UserTransformableViewportVirtualScrollCanvasController(
          canvasController,
          trigger!,
          this.transformOptions,
          this.virtualScrollOptions,
        );
    } else if (this.hasTransformableViewport) {
      canvasController = new UserTransformableViewportCanvasController(
        canvasController,
        this.transformOptions,
      );
    }

    this.reset();

    return new Canvas(canvasController);
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
