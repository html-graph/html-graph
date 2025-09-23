import {
  VirtualScrollHtmlView,
  CoreHtmlView,
  HtmlView,
  LayoutHtmlView,
  RenderingBox,
} from "@/html-view";
import { EventSubject } from "@/event-subject";
import { Canvas } from "@/canvas";
import { GraphStore } from "@/graph-store";
import { ViewportStore } from "@/viewport-store";
import {
  BackgroundConfigurator,
  DraggableNodesParams,
  NodeResizeReactiveEdgesConfigurator,
  UserConnectablePortsConfigurator,
  UserDraggableEdgesConfigurator,
  UserDraggableNodesConfigurator,
  UserTransformableViewportConfigurator,
  UserTransformableViewportVirtualScrollConfigurator,
  LayoutConfigurator,
  AnimatedLayoutConfigurator,
} from "@/configurators";
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
  createConnectablePortsParams,
} from "./create-connectable-ports-params";
import {
  createDraggableEdgeParams,
  DraggableEdgesConfig,
} from "./create-draggable-edges-params";
import {
  createVirtualScrollParams,
  VirtualScrollConfig,
} from "./create-virtual-scroll-params";
import { createVirtualScrollHtmlViewParams } from "./create-virtual-scroll-html-view-params";
import { CanvasBuilderError } from "./canvas-builder-error";
import { Graph } from "@/graph";
import { Viewport } from "@/viewport";
import { Identifier } from "@/identifier";
import {
  AnimatedLayoutConfig,
  createAnimatedLayoutAlgorithm,
} from "./create-animated-layout-params";
import { createLayoutParams, LayoutConfig } from "./create-layout-params";
import { patchAnimatedLayoutDraggableNodesParams } from "./patch-animated-layout-draggable-nodes-params";
import { subscribeAnimatedLayoutStaticNodesUpdate } from "./subscribe-animated-layout-static-nodes-update";

export class CanvasBuilder {
  private used = false;

  private canvasDefaults: CanvasDefaults = {};

  private dragConfig: DraggableNodesConfig = {};

  private transformConfig: ViewportTransformConfig = {};

  private backgroundConfig: BackgroundConfig = {};

  private connectablePortsConfig: ConnectablePortsConfig = {};

  private draggableEdgesConfig: DraggableEdgesConfig = {};

  private virtualScrollConfig: VirtualScrollConfig | undefined = undefined;

  private layoutConfig: LayoutConfig | undefined = undefined;

  private animatedLayoutConfig: AnimatedLayoutConfig | undefined = undefined;

  private hasDraggableNodes = false;

  private hasTransformableViewport = false;

  private hasNodeResizeReactiveEdges = false;

  private hasBackground = false;

  private hasUserConnectablePorts = false;

  private hasUserDraggableEdges = false;

  private hasAnimatedLayout = false;

  private readonly boxRenderingTrigger = new EventSubject<RenderingBox>();

  private readonly graphStore = new GraphStore();

  private readonly viewportStore = new ViewportStore();

  private readonly graph = new Graph(this.graphStore);

  private readonly viewport = new Viewport(this.viewportStore);

  private readonly window: Window = window;

  private readonly animationStaticNodes = new Set<Identifier>();

  public constructor(private readonly element: HTMLElement) {}

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
    this.hasDraggableNodes = true;
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
   * enables automatic edges update on node resize
   */
  public enableNodeResizeReactiveEdges(): CanvasBuilder {
    this.hasNodeResizeReactiveEdges = true;

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
    this.hasUserConnectablePorts = true;
    this.connectablePortsConfig = config ?? {};

    return this;
  }

  /**
   * enables edges dragging by dragging one of the adjacent ports
   */
  public enableUserDraggableEdges(
    config?: DraggableEdgesConfig,
  ): CanvasBuilder {
    this.hasUserDraggableEdges = true;
    this.draggableEdgesConfig = config ?? {};

    return this;
  }

  /**
   * enables nodes positioning with specified layout
   */
  public enableLayout(config: LayoutConfig): CanvasBuilder {
    this.layoutConfig = config;
    this.animatedLayoutConfig = undefined;
    this.hasAnimatedLayout = false;

    return this;
  }

  /**
   * enables animated nodes positioning with specified layout
   */
  public enableAnimatedLayout(config?: AnimatedLayoutConfig): CanvasBuilder {
    this.animatedLayoutConfig = config;
    this.hasAnimatedLayout = true;
    this.layoutConfig = undefined;

    return this;
  }

  /**
   * builds final canvas
   */
  public build(): Canvas {
    if (this.used) {
      throw new CanvasBuilderError("CanvasBuilder is a single use object");
    }

    this.used = true;

    const layers = new Layers(this.element);

    let htmlView: HtmlView = new CoreHtmlView(
      this.graphStore,
      this.viewportStore,
      layers.main,
    );

    if (this.virtualScrollConfig !== undefined) {
      htmlView = new VirtualScrollHtmlView(
        htmlView,
        this.graphStore,
        this.boxRenderingTrigger,
        createVirtualScrollHtmlViewParams(this.virtualScrollConfig),
      );
    }

    htmlView = new LayoutHtmlView(htmlView, this.graphStore);

    const canvasParams = createCanvasParams(this.canvasDefaults);

    const canvas = new Canvas(
      this.graph,
      this.viewport,
      this.graphStore,
      this.viewportStore,
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

    if (this.hasNodeResizeReactiveEdges) {
      NodeResizeReactiveEdgesConfigurator.configure(canvas);
    }

    if (this.hasDraggableNodes) {
      let draggableNodesParams: DraggableNodesParams =
        createDraggableNodesParams(this.dragConfig);

      if (this.hasAnimatedLayout) {
        draggableNodesParams = patchAnimatedLayoutDraggableNodesParams(
          draggableNodesParams,
          this.animationStaticNodes,
        );
      }

      UserDraggableNodesConfigurator.configure(
        canvas,
        layers.main,
        this.window,
        draggableNodesParams,
      );
    }

    if (this.hasUserConnectablePorts) {
      const params = createConnectablePortsParams(
        this.connectablePortsConfig,
        canvasParams.edges.shapeFactory,
        canvasParams.ports.direction,
      );

      UserConnectablePortsConfigurator.configure(
        canvas,
        layers.overlayConnectablePorts,
        this.viewportStore,
        this.window,
        params,
      );
    }

    if (this.hasUserDraggableEdges) {
      const dragEdgeParams = createDraggableEdgeParams(
        this.draggableEdgesConfig,
        canvas.graph,
      );

      UserDraggableEdgesConfigurator.configure(
        canvas,
        layers.overlayDraggableEdges,
        this.viewportStore,
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
        this.boxRenderingTrigger,
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

    if (this.layoutConfig !== undefined) {
      LayoutConfigurator.configure(
        canvas,
        createLayoutParams(this.layoutConfig),
      );
    }

    if (this.hasAnimatedLayout) {
      subscribeAnimatedLayoutStaticNodesUpdate(
        canvas.graph,
        this.animationStaticNodes,
      );

      AnimatedLayoutConfigurator.configure(
        canvas,
        createAnimatedLayoutAlgorithm(this.animatedLayoutConfig),
        this.animationStaticNodes,
        this.window,
      );
    }

    const onBeforeDestroy = (): void => {
      layers.destroy();
      canvas.onBeforeDestroy.unsubscribe(onBeforeDestroy);
    };

    canvas.onBeforeDestroy.subscribe(onBeforeDestroy);

    return canvas;
  }
}
