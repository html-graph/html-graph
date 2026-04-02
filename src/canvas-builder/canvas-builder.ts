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
  AnimatedLayoutParams,
  LayoutParams,
  UserSelectableNodesConfigurator,
  UserSelectableCanvasConfigurator,
  PointInsideVerifier,
} from "@/configurators";
import { Layers } from "./layers";
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
  createAnimatedLayoutParams,
} from "./create-animated-layout-params";
import { createLayoutParams, LayoutConfig } from "./create-layout-params";
import { patchAnimatedLayoutDraggableNodesParams } from "./patch-animated-layout-draggable-nodes-params";
import { subscribeAnimatedLayoutStaticNodesUpdate } from "./subscribe-animated-layout-static-nodes-update";
import { patchDraggableNodesAnimatedLayoutParams } from "./patch-draggable-nodes-animated-layout-params";
import { GraphController } from "@/graph-controller";
import { ViewportController } from "@/viewport-controller";
import { createGraphControllerParams } from "./create-graph-controller-params";
import { createViewportControllerParams } from "./create-viewport-controller-params";
import { CanvasDefaults } from "./shared";
import {
  createUserSelectableNodesParams,
  UserSelectableNodesConfig,
} from "./create-user-selectable-nodes-params";
import {
  createUserSelectableCanvasParams,
  UserSelectableCanvasConfig,
} from "./create-user-selectable-canvas-params";

export class CanvasBuilder {
  private used = false;

  private canvasDefaults: CanvasDefaults = {};

  private dragConfig: DraggableNodesConfig = {};

  private transformConfig: ViewportTransformConfig = {};

  private backgroundConfig: BackgroundConfig = {};

  private connectablePortsConfig: ConnectablePortsConfig = {};

  private draggableEdgesConfig: DraggableEdgesConfig = {};

  private virtualScrollConfig: VirtualScrollConfig | undefined = undefined;

  private layoutConfig: LayoutConfig = {};

  private animatedLayoutConfig: AnimatedLayoutConfig = {};

  private userSelectableNodesConfig: UserSelectableNodesConfig | undefined =
    undefined;

  private userSelectableCanvasConfig: UserSelectableCanvasConfig | undefined =
    undefined;

  private hasDraggableNodes = false;

  private hasTransformableViewport = false;

  private hasNodeResizeReactiveEdges = false;

  private hasBackground = false;

  private hasUserConnectablePorts = false;

  private hasUserDraggableEdges = false;

  private hasAnimatedLayout = false;

  private hasLayout = false;

  private readonly boxRenderingTrigger = new EventSubject<RenderingBox>();

  private readonly window: Window = window;

  private readonly animationStaticNodes = new Set<Identifier>();

  public constructor(private readonly element: HTMLElement) {}

  public setDefaults(defaults: CanvasDefaults): CanvasBuilder {
    this.canvasDefaults = defaults;

    return this;
  }

  public enableUserDraggableNodes(
    config?: DraggableNodesConfig | undefined,
  ): CanvasBuilder {
    this.hasDraggableNodes = true;
    this.dragConfig = config ?? {};

    return this;
  }

  public enableUserTransformableViewport(
    config?: ViewportTransformConfig | undefined,
  ): CanvasBuilder {
    this.hasTransformableViewport = true;
    this.transformConfig = config ?? {};

    return this;
  }

  public enableNodeResizeReactiveEdges(): CanvasBuilder {
    this.hasNodeResizeReactiveEdges = true;

    return this;
  }

  public enableVirtualScroll(config: VirtualScrollConfig): CanvasBuilder {
    this.virtualScrollConfig = config;

    return this;
  }

  public enableBackground(
    config?: BackgroundConfig | undefined,
  ): CanvasBuilder {
    this.hasBackground = true;
    this.backgroundConfig = config ?? {};

    return this;
  }

  public enableUserConnectablePorts(
    config?: ConnectablePortsConfig | undefined,
  ): CanvasBuilder {
    this.hasUserConnectablePorts = true;
    this.connectablePortsConfig = config ?? {};

    return this;
  }

  public enableUserDraggableEdges(
    config?: DraggableEdgesConfig | undefined,
  ): CanvasBuilder {
    this.hasUserDraggableEdges = true;
    this.draggableEdgesConfig = config ?? {};

    return this;
  }

  public enableLayout(config?: LayoutConfig | undefined): CanvasBuilder {
    this.layoutConfig = config ?? {};
    this.hasLayout = true;
    this.hasAnimatedLayout = false;

    return this;
  }

  public enableAnimatedLayout(
    config?: AnimatedLayoutConfig | undefined,
  ): CanvasBuilder {
    this.animatedLayoutConfig = config ?? {};
    this.hasAnimatedLayout = true;
    this.hasLayout = false;

    return this;
  }

  public enableUserSelectableNodes(
    config: UserSelectableNodesConfig,
  ): CanvasBuilder {
    this.userSelectableNodesConfig = config;

    return this;
  }

  public enableUserSelectableCanvas(
    config: UserSelectableCanvasConfig,
  ): CanvasBuilder {
    this.userSelectableCanvasConfig = config;

    return this;
  }

  public build(): Canvas {
    if (this.used) {
      throw new CanvasBuilderError(
        "Failed to build Canvas because CanvasBuilder is a single-use object",
      );
    }

    this.used = true;

    const viewportStore = new ViewportStore(this.element);
    const graphStore = new GraphStore();

    const layers = new Layers(this.element);
    const htmlView = this.createHtmlView(
      layers.main,
      graphStore,
      viewportStore,
    );

    const graphControllerParams = createGraphControllerParams(
      this.canvasDefaults,
    );

    const graphController = new GraphController(
      graphStore,
      htmlView,
      graphControllerParams,
    );

    const layoutParams: LayoutParams = createLayoutParams(this.layoutConfig);

    const viewportControllerParams = createViewportControllerParams({
      canvasDefaults: this.canvasDefaults,
      hasLayout: this.hasLayout,
      layoutParams,
    });

    const viewportController = new ViewportController(
      graphStore,
      viewportStore,
      viewportControllerParams,
      this.window,
    );

    const viewport = new Viewport(viewportStore);
    const graph = new Graph(graphStore);

    const canvas = new Canvas(
      graph,
      viewport,
      graphController,
      viewportController,
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

    if (this.userSelectableNodesConfig !== undefined) {
      const params = createUserSelectableNodesParams(
        this.userSelectableNodesConfig,
      );

      UserSelectableNodesConfigurator.configure(
        canvas,
        this.window,
        new PointInsideVerifier(layers.main, this.window),
        params,
      );
    }

    if (this.userSelectableCanvasConfig !== undefined) {
      const params = createUserSelectableCanvasParams(
        this.userSelectableCanvasConfig,
      );

      UserSelectableCanvasConfigurator.configure(
        canvas,
        layers.main,
        this.window,
        new PointInsideVerifier(layers.main, this.window),
        params,
      );
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
        new PointInsideVerifier(layers.main, this.window),
        draggableNodesParams,
      );
    }

    if (this.hasUserConnectablePorts) {
      const params = createConnectablePortsParams(
        this.connectablePortsConfig,
        graphControllerParams.edges.shapeFactory,
        graphControllerParams.ports.direction,
      );

      UserConnectablePortsConfigurator.configure(
        canvas,
        layers.overlayConnectablePorts,
        viewportStore,
        this.window,
        new PointInsideVerifier(layers.overlayConnectablePorts, this.window),
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
        viewportStore,
        this.window,
        new PointInsideVerifier(layers.overlayDraggableEdges, this.window),
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
        new PointInsideVerifier(layers.main, this.window),
        createVirtualScrollParams(this.virtualScrollConfig),
      );
    } else if (this.hasTransformableViewport) {
      UserTransformableViewportConfigurator.configure(
        canvas,
        layers.main,
        this.window,
        new PointInsideVerifier(layers.main, this.window),
        createTransformableViewportParams(this.transformConfig),
      );
    }

    if (this.hasLayout) {
      LayoutConfigurator.configure(canvas, layoutParams);
    }

    if (this.hasAnimatedLayout) {
      let config: AnimatedLayoutParams = createAnimatedLayoutParams(
        this.animatedLayoutConfig,
      );

      if (this.hasDraggableNodes) {
        subscribeAnimatedLayoutStaticNodesUpdate(
          canvas,
          this.animationStaticNodes,
        );

        config = patchDraggableNodesAnimatedLayoutParams(
          config,
          this.animationStaticNodes,
        );
      }

      AnimatedLayoutConfigurator.configure(canvas, config, this.window);
    }

    const onBeforeDestroy = (): void => {
      layers.destroy();
      canvas.onBeforeDestroy.unsubscribe(onBeforeDestroy);
    };

    canvas.onBeforeDestroy.subscribe(onBeforeDestroy);

    return canvas;
  }

  private createHtmlView(
    host: HTMLElement,
    graphStore: GraphStore,
    viewportStore: ViewportStore,
  ): HtmlView {
    let htmlView: HtmlView = new CoreHtmlView(graphStore, viewportStore, host);

    if (this.virtualScrollConfig !== undefined) {
      htmlView = new VirtualScrollHtmlView(
        htmlView,
        graphStore,
        this.boxRenderingTrigger,
        createVirtualScrollHtmlViewParams(this.virtualScrollConfig),
      );
    }

    htmlView = new LayoutHtmlView(htmlView, graphStore);

    return htmlView;
  }
}
