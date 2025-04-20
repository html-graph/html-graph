import {
  CanvasController,
  UserDraggableNodesCanvasController,
  DragOptions,
  UserTransformableViewportCanvasController,
  TransformOptions,
  CoreCanvasController,
  UserTransformableViewportVirtualScrollCanvasController,
  VirtualScrollOptions,
} from "@/canvas-controller";
import { BoxHtmlView, CoreHtmlView, HtmlView, RenderingBox } from "@/html-view";
import { EventSubject } from "@/event-subject";
import { Canvas, CanvasDefaults } from "@/canvas";
import { GraphStore } from "@/graph-store";
import { ViewportStore } from "@/viewport-store";
import { ResizeReactiveNodesConfigurator } from "./configurators";
import { HtmlGraphError } from "./error";

export class CanvasBuilder {
  private element: HTMLElement | null = null;

  private canvasDefaults: CanvasDefaults = {};

  private dragOptions: DragOptions | undefined = undefined;

  private transformOptions: TransformOptions | undefined = undefined;

  private virtualScrollOptions: VirtualScrollOptions | undefined = undefined;

  private hasDraggableNode = false;

  private hasTransformableViewport = false;

  private hasResizeReactiveNodes = false;

  private boxRenderingTrigger: EventSubject<RenderingBox> | undefined =
    undefined;

  public attach(element: HTMLElement): CanvasBuilder {
    this.element = element;

    return this;
  }

  /**
   * specifies default values for graph entities
   */
  public setDefaults(defaults: CanvasDefaults): CanvasBuilder {
    this.canvasDefaults = defaults;

    return this;
  }

  /**
   * @deprecated
   * use setDefaults instead
   */
  public setOptions(options: CanvasDefaults): CanvasBuilder {
    this.setDefaults(options);

    return this;
  }

  /**
   * enables nodes draggable by user
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
    if (this.element === null) {
      throw new HtmlGraphError(
        "unable to build canvas when no attach element specified",
      );
    }

    let trigger = this.boxRenderingTrigger;

    if (this.virtualScrollOptions !== undefined && trigger === undefined) {
      trigger = new EventSubject<RenderingBox>();
    }

    const graphStore = new GraphStore();
    const viewportStore = new ViewportStore();

    let htmlView: HtmlView = new CoreHtmlView(graphStore, viewportStore);

    if (trigger !== undefined) {
      htmlView = new BoxHtmlView(htmlView, graphStore, trigger);
    }

    let controller: CanvasController = new CoreCanvasController(
      graphStore,
      viewportStore,
      htmlView,
    );

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

    const canvas = new Canvas(this.element, controller, this.canvasDefaults);

    if (this.hasResizeReactiveNodes) {
      ResizeReactiveNodesConfigurator.configure(canvas);
    }

    this.reset();

    return canvas;
  }

  private reset(): void {
    this.element = null;
    this.canvasDefaults = {};
    this.dragOptions = undefined;
    this.transformOptions = undefined;
    this.virtualScrollOptions = undefined;
    this.hasDraggableNode = false;
    this.hasTransformableViewport = false;
    this.hasResizeReactiveNodes = false;
    this.boxRenderingTrigger = undefined;
  }
}
