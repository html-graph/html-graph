import { BoxHtmlView, CoreHtmlView, HtmlView, RenderingBox } from "@/html-view";
import { EventSubject } from "@/event-subject";
import { Canvas } from "@/canvas";
import { GraphStore } from "@/graph-store";
import { ViewportStore } from "@/viewport-store";
import {
  BackgroundConfigurator,
  ResizeReactiveNodesConfigurator,
  UserConnectablePortsConfigurator,
  UserDraggableEdgesConfigurator,
  UserDraggableNodesConfigurator,
  UserTransformableViewportConfigurator,
  UserTransformableViewportVirtualScrollConfigurator,
} from "@/configurators";
import { HtmlGraphError } from "@/error";
import { Layers } from "./layers";
import { CanvasDefaults, createCanvasParams } from "./create-canvas-params";
import {
  createDraggableNodesParams,
  DraggableNodesConfig,
} from "./create-draggable-nodes-params";
import {
  createTransformableViewportParams,
  ViewportTransformConfig,
} from "./create-transformable-viewport-params";
import {
  BackgroundConfig,
  createBackgroundParams,
} from "./create-background-params";
import {
  ConnectablePortsConfig,
  createUserConnectablePortsParams,
} from "./create-user-connectable-ports-params";
import {
  createUserDraggableEdgeParams,
  DraggableEdgesConfig,
} from "./create-user-draggable-edges-params";
import {
  createVirtualScrollParams,
  VirtualScrollConfig,
} from "./create-virtual-scroll-params";
import { createBoxHtmlViewParams } from "./create-box-html-view-params";

export class CanvasBuilder {
  private element: HTMLElement | null = null;

  private canvasDefaults: CanvasDefaults = {};

  private dragConfig: DraggableNodesConfig = {};

  private transformConfig: ViewportTransformConfig = {};

  private backgroundConfig: BackgroundConfig = {};

  private connectablePortsConfig: ConnectablePortsConfig = {};

  private draggableEdgesConfig: DraggableEdgesConfig = {};

  private virtualScrollConfig: VirtualScrollConfig | undefined = undefined;

  private hasDraggableNode = false;

  private hasTransformableViewport = false;

  private hasResizeReactiveNodes = false;

  private hasBackground = false;

  private hasUserConnectablePorts = false;

  private hasUserDraggableEdges = false;

  private boxRenderingTrigger: EventSubject<RenderingBox> | undefined =
    undefined;

  private readonly window = window;

  public constructor(element?: HTMLElement) {
    if (element !== undefined) {
      this.element = element;
    }
  }

  /**
   * @deprecated
   * use `new CanvasBuilder(element);` instead
   */
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
  public enableUserDraggableNodes(
    config?: DraggableNodesConfig,
  ): CanvasBuilder {
    this.hasDraggableNode = true;
    this.dragConfig = config ?? {};

    return this;
  }

  /**
   * enables viewport transformable by user
   */
  public enableUserTransformableViewport(
    config?: ViewportTransformConfig,
  ): CanvasBuilder {
    this.hasTransformableViewport = true;
    this.transformConfig = config ?? {};

    return this;
  }

  /**
   * @deprecated
   * use enableNodeResizeReactiveEdges instead
   */
  public enableResizeReactiveNodes(): CanvasBuilder {
    this.hasResizeReactiveNodes = true;

    return this;
  }

  /**
   * enables automatic edges update on node resize
   */
  public enableNodeResizeReactiveEdges(): CanvasBuilder {
    this.hasResizeReactiveNodes = true;

    return this;
  }

  /**
   * @deprecated
   * do not use
   * sets emitter for rendering graph inside bounded area
   */
  public enableBoxAreaRendering(
    trigger: EventSubject<RenderingBox>,
  ): CanvasBuilder {
    this.boxRenderingTrigger = trigger;

    return this;
  }

  /**
   * enables built-in virtual scroll behavior, when only nodes and edges close
   * to viewport are rendered
   */
  public enableVirtualScroll(config: VirtualScrollConfig): CanvasBuilder {
    this.virtualScrollConfig = config;

    return this;
  }

  /**
   * enables built-in background rendering
   */
  public enableBackground(config?: BackgroundConfig): CanvasBuilder {
    this.hasBackground = true;
    this.backgroundConfig = config ?? {};

    return this;
  }

  /**
   * enables edge creation by dragging one port to another
   */
  public enableUserConnectablePorts(
    config?: ConnectablePortsConfig,
  ): CanvasBuilder {
    this.connectablePortsConfig = config ?? {};
    this.hasUserConnectablePorts = true;

    return this;
  }

  public enableUserDraggableEdges(
    config?: DraggableEdgesConfig,
  ): CanvasBuilder {
    this.hasUserDraggableEdges = true;
    this.draggableEdgesConfig = config ?? {};

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

    if (this.virtualScrollConfig !== undefined && trigger === undefined) {
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
      htmlView = new BoxHtmlView(
        htmlView,
        graphStore,
        trigger,
        createBoxHtmlViewParams(this.virtualScrollConfig),
      );
    }

    const canvasParams = createCanvasParams(this.canvasDefaults);

    const canvas = new Canvas(
      this.element,
      graphStore,
      viewportStore,
      htmlView,
      canvasParams,
    );

    if (this.hasBackground) {
      BackgroundConfigurator.configure(
        canvas,
        createBackgroundParams(this.backgroundConfig),
        layers.background,
      );
    }

    if (this.hasResizeReactiveNodes) {
      ResizeReactiveNodesConfigurator.configure(canvas);
    }

    if (this.hasDraggableNode) {
      UserDraggableNodesConfigurator.configure(
        canvas,
        layers.main,
        this.window,
        createDraggableNodesParams(this.dragConfig),
      );
    }

    if (this.hasUserConnectablePorts) {
      const params = createUserConnectablePortsParams(
        this.connectablePortsConfig,
        canvasParams.edges.shapeFactory,
        canvasParams.ports.direction,
      );

      UserConnectablePortsConfigurator.configure(
        canvas,
        layers.overlayConnectablePorts,
        viewportStore,
        this.window,
        params,
      );
    }

    if (this.hasUserDraggableEdges) {
      const dragEdgeParams = createUserDraggableEdgeParams(
        this.draggableEdgesConfig,
        canvas.graph,
      );

      UserDraggableEdgesConfigurator.configure(
        canvas,
        layers.overlayDraggableEdges,
        viewportStore,
        this.window,
        dragEdgeParams,
      );
    }

    if (this.virtualScrollConfig !== undefined) {
      UserTransformableViewportVirtualScrollConfigurator.configure(
        canvas,
        layers.main,
        this.window,
        createTransformableViewportParams(this.transformConfig),
        trigger!,
        createVirtualScrollParams(this.virtualScrollConfig),
      );
    } else if (this.hasTransformableViewport) {
      UserTransformableViewportConfigurator.configure(
        canvas,
        layers.main,
        this.window,
        createTransformableViewportParams(this.transformConfig),
      );
    }

    this.reset();

    const onBeforeDestroy = (): void => {
      layers.destroy();
      canvas.onBeforeDestroy.unsubscribe(onBeforeDestroy);
    };

    canvas.onBeforeDestroy.subscribe(onBeforeDestroy);

    return canvas;
  }

  /**
   * @deprecated
   * CanvasBuilder should be single use object
   */
  private reset(): void {
    this.element = null;
    this.canvasDefaults = {};
    this.dragConfig = {};
    this.transformConfig = {};
    this.backgroundConfig = {};
    this.virtualScrollConfig = undefined;
    this.hasDraggableNode = false;
    this.hasTransformableViewport = false;
    this.hasResizeReactiveNodes = false;
    this.hasBackground = false;
    this.boxRenderingTrigger = undefined;
    this.hasUserConnectablePorts = false;
  }
}
