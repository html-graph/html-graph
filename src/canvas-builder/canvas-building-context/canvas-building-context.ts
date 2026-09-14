import { Canvas } from "@/canvas";
import { CanvasBuildingContextParams } from "./canvas-building-context-params";
import { ViewportStore } from "@/viewport-store";
import { GraphStore } from "@/graph-store";
import { Layers } from "../layers";
import { createGraphControllerParams } from "../create-graph-controller-params";
import { GraphController, GraphControllerParams } from "@/graph-controller";
import { createLayoutParams } from "../create-layout-params";
import { createViewportControllerParams } from "../create-viewport-controller-params";
import { ViewportController } from "@/viewport-controller";
import { EventSubject } from "@/event-subject";
import {
  CoreHtmlView,
  HtmlView,
  LayoutHtmlView,
  RenderingBox,
  VirtualScrollHtmlView,
} from "@/html-view";
import { Identifier } from "@/identifier";
import {
  AnimatedLayoutConfigurator,
  BackgroundConfigurator,
  EventTagger,
  LayoutConfigurator,
  LayoutParams,
  NodeResizeReactiveEdgesConfigurator,
  PointInsideVerifier,
  RectangularSelectionConfigurator,
  UserConnectablePortsConfigurator,
  UserDraggableEdgesConfigurator,
  UserDraggableNodesConfigurator,
  UserSelectableCanvasConfigurator,
  UserSelectableEdgesConfigurator,
  UserSelectableNodesConfigurator,
  UserTransformableViewportConfigurator,
  UserTransformableViewportVirtualScrollConfigurator,
} from "@/configurators";
import { createBackgroundParams } from "../create-background-params";
import { Viewport } from "@/viewport";
import { Graph } from "@/graph";
import { createUserSelectableEdgesParams } from "../create-user-selectable-edges-params";
import { createUserSelectableNodesParams } from "../create-user-selectable-nodes-params";
import { createUserSelectableCanvasParams } from "../create-user-selectable-canvas-params";
import { createDraggableNodesParams } from "../create-draggable-nodes-params";
import { patchAnimatedLayoutDraggableNodesParams } from "../patch-animated-layout-draggable-nodes-params";
import { createConnectablePortsParams } from "../create-connectable-ports-params";
import { createDraggableEdgeParams } from "../create-draggable-edges-params";
import { createUserTransformableViewportParams } from "../create-user-transformable-viewport-params";
import { createVirtualScrollParams } from "../create-virtual-scroll-params";
import { createRectangularSelectionParams } from "../create-rectangular-selection-params";
import { createAnimatedLayoutParams } from "../create-animated-layout-params";
import { subscribeAnimatedLayoutStaticNodesUpdate } from "../subscribe-animated-layout-static-nodes-update";
import { patchDraggableNodesAnimatedLayoutParams } from "../patch-draggable-nodes-animated-layout-params";
import { createVirtualScrollHtmlViewParams } from "../create-virtual-scroll-html-view-params";

export class CanvasBuildingContext {
  private readonly boxRenderingTrigger = new EventSubject<RenderingBox>();

  private readonly window: Window = window;

  private readonly animationStaticNodes = new Set<Identifier>();

  private readonly pointInsideVerifier: PointInsideVerifier;

  private readonly eventTagger = new EventTagger();

  private readonly viewportStore: ViewportStore;

  private readonly graphStore = new GraphStore();

  private readonly layers: Layers;

  private readonly htmlView: HtmlView;

  private readonly graphControllerParams: GraphControllerParams;

  private readonly graphController: GraphController;

  private readonly layoutParams: LayoutParams;

  public readonly canvas: Canvas;

  public constructor(
    private readonly element: HTMLElement,
    private readonly params: CanvasBuildingContextParams,
  ) {
    this.pointInsideVerifier = new PointInsideVerifier(
      this.element,
      this.window,
    );

    this.viewportStore = new ViewportStore(this.element);
    this.layers = new Layers(this.element);

    this.htmlView = this.createHtmlView(
      this.layers.main,
      this.graphStore,
      this.viewportStore,
    );

    this.graphControllerParams = createGraphControllerParams(
      this.params.canvasDefaults,
    );

    this.graphController = new GraphController(
      this.graphStore,
      this.htmlView,
      this.graphControllerParams,
    );

    this.layoutParams = createLayoutParams(this.params.layout.config);

    const viewportControllerParams = createViewportControllerParams({
      canvasDefaults: this.params.canvasDefaults,
      hasLayout: this.params.layout.enabled,
      layoutParams: this.layoutParams,
    });

    const viewportController = new ViewportController(
      this.graphStore,
      this.viewportStore,
      viewportControllerParams,
      this.window,
    );

    const viewport = new Viewport(this.viewportStore);
    const graph = new Graph(this.graphStore);

    this.canvas = new Canvas(
      graph,
      viewport,
      this.graphController,
      viewportController,
    );

    if (this.params.background.enabled) {
      BackgroundConfigurator.configure(
        this.canvas,
        createBackgroundParams(this.params.background.config),
        this.layers.background,
      );
    }

    if (this.params.nodeResizeReactiveEdges.enabled) {
      NodeResizeReactiveEdgesConfigurator.configure(this.canvas);
    }

    if (this.params.userSelectableEdges.enabled) {
      const params = createUserSelectableEdgesParams(
        this.params.userSelectableEdges.config,
      );

      UserSelectableEdgesConfigurator.configure(
        this.canvas,
        this.window,
        this.pointInsideVerifier,
        this.eventTagger,
        params,
      );
    }

    if (this.params.userSelectableNodes.enabled) {
      const params = createUserSelectableNodesParams(
        this.params.userSelectableNodes.config,
      );

      UserSelectableNodesConfigurator.configure(
        this.canvas,
        this.window,
        this.pointInsideVerifier,
        this.eventTagger,
        params,
      );
    }

    if (this.params.userSelectableCanvas.enabled) {
      const params = createUserSelectableCanvasParams(
        this.params.userSelectableCanvas.config,
      );

      UserSelectableCanvasConfigurator.configure(
        this.canvas,
        this.layers.main,
        this.window,
        this.pointInsideVerifier,
        this.eventTagger,
        params,
      );
    }

    if (this.params.draggableNodes.enabled) {
      let draggableNodesParams = createDraggableNodesParams(
        this.params.draggableNodes.config,
      );

      if (this.params.animatedLayout.enabled) {
        draggableNodesParams = patchAnimatedLayoutDraggableNodesParams(
          draggableNodesParams,
          this.animationStaticNodes,
        );
      }

      UserDraggableNodesConfigurator.configure(
        this.canvas,
        this.layers.main,
        this.window,
        this.pointInsideVerifier,
        this.eventTagger,
        draggableNodesParams,
      );
    }

    if (this.params.userConnectablePorts.enabled) {
      const params = createConnectablePortsParams(
        this.params.userConnectablePorts.config,
        this.graphControllerParams.edges.shapeFactory,
        this.canvas.graph,
      );

      UserConnectablePortsConfigurator.configure(
        this.canvas,
        this.layers.overlayConnectablePorts,
        this.viewportStore,
        this.window,
        this.pointInsideVerifier,
        this.eventTagger,
        params,
      );
    }

    if (this.params.userDraggableEdges.enabled) {
      const dragEdgeParams = createDraggableEdgeParams(
        this.params.userDraggableEdges.config,
        this.canvas.graph,
      );

      UserDraggableEdgesConfigurator.configure(
        this.canvas,
        this.layers.overlayDraggableEdges,
        this.viewportStore,
        this.window,
        this.pointInsideVerifier,
        this.eventTagger,
        dragEdgeParams,
      );
    }

    if (this.params.virtualScroll.enabled) {
      UserTransformableViewportVirtualScrollConfigurator.configure(
        this.canvas,
        this.layers.main,
        this.window,
        createUserTransformableViewportParams(
          this.params.userTransformableViewport.config,
        ),
        this.boxRenderingTrigger,
        this.pointInsideVerifier,
        this.eventTagger,
        createVirtualScrollParams(this.params.virtualScroll.config),
      );
    } else if (this.params.userTransformableViewport.enabled) {
      UserTransformableViewportConfigurator.configure(
        this.canvas,
        this.layers.main,
        this.window,
        this.pointInsideVerifier,
        this.eventTagger,
        createUserTransformableViewportParams(
          this.params.userTransformableViewport.config,
        ),
      );
    }

    if (this.params.rectangularSelection.enabled) {
      RectangularSelectionConfigurator.configure(
        this.canvas,
        this.layers.main,
        this.layers.overlayRectangularSelection,
        this.pointInsideVerifier,
        this.eventTagger,
        this.window,
        createRectangularSelectionParams(
          this.params.rectangularSelection.config,
        ),
      );
    }

    if (this.params.layout.enabled) {
      LayoutConfigurator.configure(this.canvas, this.layoutParams);
    }

    if (this.params.animatedLayout.enabled) {
      let config = createAnimatedLayoutParams(
        this.params.animatedLayout.config,
      );

      if (this.params.draggableNodes.enabled) {
        subscribeAnimatedLayoutStaticNodesUpdate(
          this.canvas,
          this.animationStaticNodes,
        );

        config = patchDraggableNodesAnimatedLayoutParams(
          config,
          this.animationStaticNodes,
        );
      }

      AnimatedLayoutConfigurator.configure(this.canvas, config, this.window);
    }

    this.canvas.onBeforeDestroy.subscribe(() => {
      this.layers.destroy();
    });
  }

  private createHtmlView(
    host: HTMLElement,
    graphStore: GraphStore,
    viewportStore: ViewportStore,
  ): HtmlView {
    let htmlView: HtmlView = new CoreHtmlView(graphStore, viewportStore, host);

    if (this.params.virtualScroll.enabled) {
      htmlView = new VirtualScrollHtmlView(
        htmlView,
        graphStore,
        this.boxRenderingTrigger,
        createVirtualScrollHtmlViewParams(this.params.virtualScroll.config),
      );
    }

    htmlView = new LayoutHtmlView(htmlView, graphStore);

    return htmlView;
  }
}
