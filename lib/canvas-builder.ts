import { BoxHtmlView, CoreHtmlView, HtmlView, RenderingBox } from "@/html-view";
import { EventSubject } from "@/event-subject";
import { Canvas, CanvasDefaults } from "@/canvas";
import { GraphStore } from "@/graph-store";
import { ViewportStore } from "@/viewport-store";
import {
  BackgroundConfigurator,
  DragOptions,
  ResizeReactiveNodesConfigurator,
  TransformOptions,
  UserDraggableNodesConfigurator,
  UserTransformableViewportConfigurator,
  UserTransformableViewportVirtualScrollConfigurator,
  VirtualScrollOptions,
} from "@/configurators";
import { HtmlGraphError } from "@/error";
import { Layers } from "./layers";

/**
 * Responsibility: Constructs canvas based on specified configuration
 */
export class CanvasBuilder {
  private element: HTMLElement | null = null;

  private canvasDefaults: CanvasDefaults = {};

  private dragOptions: DragOptions = {};

  private transformOptions: TransformOptions = {};

  private virtualScrollOptions: VirtualScrollOptions | undefined = undefined;

  private hasDraggableNode = false;

  private hasTransformableViewport = false;

  private hasResizeReactiveNodes = false;

  private hasBackground = false;

  private boxRenderingTrigger: EventSubject<RenderingBox> | undefined =
    undefined;

  public setElement(element: HTMLElement): CanvasBuilder {
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
   * enables nodes draggable by user
   */
  public enableUserDraggableNodes(options?: DragOptions): CanvasBuilder {
    this.hasDraggableNode = true;
    this.dragOptions = options ?? {};

    return this;
  }

  /**
   * enables viewport transformable by user
   */
  public enableUserTransformableViewport(
    options?: TransformOptions,
  ): CanvasBuilder {
    this.hasTransformableViewport = true;
    this.transformOptions = options ?? {};

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

  public enableBackground(): CanvasBuilder {
    this.hasBackground = true;

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
    const layers = new Layers(this.element);

    let htmlView: HtmlView = new CoreHtmlView(
      graphStore,
      viewportStore,
      layers.main,
    );

    if (trigger !== undefined) {
      htmlView = new BoxHtmlView(htmlView, graphStore, trigger);
    }

    const canvas = new Canvas(
      this.element,
      graphStore,
      viewportStore,
      htmlView,
      this.canvasDefaults,
    );

    const onBeforeDestroy = (): void => {
      layers.destroy();
      canvas.onBeforeDestroy.unsubscribe(onBeforeDestroy);
    };

    canvas.onBeforeDestroy.subscribe(onBeforeDestroy);

    if (this.hasBackground) {
      BackgroundConfigurator.configure(canvas, layers.background);
    }

    if (this.hasResizeReactiveNodes) {
      ResizeReactiveNodesConfigurator.configure(canvas);
    }

    if (this.hasDraggableNode) {
      UserDraggableNodesConfigurator.configure(
        canvas,
        layers.main,
        this.dragOptions,
      );
    }

    if (this.virtualScrollOptions !== undefined) {
      UserTransformableViewportVirtualScrollConfigurator.configure(
        canvas,
        layers.main,
        this.transformOptions,
        trigger!,
        this.virtualScrollOptions,
      );
    } else if (this.hasTransformableViewport) {
      UserTransformableViewportConfigurator.configure(
        canvas,
        layers.main,
        this.transformOptions,
      );
    }

    this.reset();

    return canvas;
  }

  private reset(): void {
    this.element = null;
    this.canvasDefaults = {};
    this.dragOptions = {};
    this.transformOptions = {};
    this.virtualScrollOptions = undefined;
    this.hasDraggableNode = false;
    this.hasTransformableViewport = false;
    this.hasResizeReactiveNodes = false;
    this.hasBackground = false;
    this.boxRenderingTrigger = undefined;
  }
}
