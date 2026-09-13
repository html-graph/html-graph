import { Canvas } from "@/canvas";
import { CanvasBuildingContextParams } from "./canvas-building-context-params";
import { ViewportStore } from "@/viewport-store";
import { GraphStore } from "@/graph-store";
import { Layers } from "../layers";
import { createGraphControllerParams } from "../create-graph-controller-params";
import { GraphController } from "@/graph-controller";
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
import { createTransformableViewportParams } from "../create-transformable-viewport-params";
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

  public constructor(
    private readonly element: HTMLElement,
    private readonly params: CanvasBuildingContextParams,
  ) {
    this.pointInsideVerifier = new PointInsideVerifier(
      this.element,
      this.window,
    );
  }

  public createCanvas(): Canvas {
    const viewportStore = new ViewportStore(this.element);
    const graphStore = new GraphStore();

    const layers = new Layers(this.element);
    const htmlView = this.createHtmlView(
      layers.main,
      graphStore,
      viewportStore,
    );

    const graphControllerParams = createGraphControllerParams(
      this.params.canvasDefaults,
    );

    const graphController = new GraphController(
      graphStore,
      htmlView,
      graphControllerParams,
    );

    const layoutParams = createLayoutParams(this.params.layout.config);

    const viewportControllerParams = createViewportControllerParams({
      canvasDefaults: this.params.canvasDefaults,
      hasLayout: this.params.layout.enabled,
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

    if (this.params.background.enabled) {
      BackgroundConfigurator.configure(
        canvas,
        createBackgroundParams(this.params.background.config),
        layers.background,
      );
    }

    if (this.params.nodeResizeReactiveEdges.enabled) {
      NodeResizeReactiveEdgesConfigurator.configure(canvas);
    }

    if (this.params.userSelectableEdges.enabled) {
      const params = createUserSelectableEdgesParams(
        this.params.userSelectableEdges.config,
      );

      UserSelectableEdgesConfigurator.configure(
        canvas,
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
        canvas,
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
        canvas,
        layers.main,
        this.window,
        this.pointInsideVerifier,
        this.eventTagger,
        params,
      );
    }

    if (this.params.userDraggableNodes) {
      let draggableNodesParams = createDraggableNodesParams(
        this.params.userDraggableNodes.config,
      );

      if (this.params.animatedLayout.enabled) {
        draggableNodesParams = patchAnimatedLayoutDraggableNodesParams(
          draggableNodesParams,
          this.animationStaticNodes,
        );
      }

      UserDraggableNodesConfigurator.configure(
        canvas,
        layers.main,
        this.window,
        this.pointInsideVerifier,
        this.eventTagger,
        draggableNodesParams,
      );
    }

    if (this.params.userConnectablePorts.enabled) {
      const params = createConnectablePortsParams(
        this.params.userConnectablePorts.config,
        graphControllerParams.edges.shapeFactory,
        canvas.graph,
      );

      UserConnectablePortsConfigurator.configure(
        canvas,
        layers.overlayConnectablePorts,
        viewportStore,
        this.window,
        this.pointInsideVerifier,
        this.eventTagger,
        params,
      );
    }

    if (this.params.userDraggableEdges.enabled) {
      const dragEdgeParams = createDraggableEdgeParams(
        this.params.userDraggableEdges.config,
        canvas.graph,
      );

      UserDraggableEdgesConfigurator.configure(
        canvas,
        layers.overlayDraggableEdges,
        viewportStore,
        this.window,
        this.pointInsideVerifier,
        this.eventTagger,
        dragEdgeParams,
      );
    }

    if (this.params.virtualScroll.enabled) {
      UserTransformableViewportVirtualScrollConfigurator.configure(
        canvas,
        layers.main,
        this.window,
        createTransformableViewportParams(
          this.params.userTransformableViewport.config,
        ),
        this.boxRenderingTrigger,
        this.pointInsideVerifier,
        this.eventTagger,
        createVirtualScrollParams(this.params.virtualScroll.config),
      );
    } else if (this.params.userTransformableViewport.enabled) {
      UserTransformableViewportConfigurator.configure(
        canvas,
        layers.main,
        this.window,
        this.pointInsideVerifier,
        this.eventTagger,
        createTransformableViewportParams(
          this.params.userTransformableViewport.config,
        ),
      );
    }

    if (this.params.rectangularSelection.enabled) {
      RectangularSelectionConfigurator.configure(
        canvas,
        layers.main,
        layers.overlayRectangularSelection,
        this.pointInsideVerifier,
        this.eventTagger,
        this.window,
        createRectangularSelectionParams(
          this.params.rectangularSelection.config,
        ),
      );
    }

    if (this.params.layout.enabled) {
      LayoutConfigurator.configure(canvas, layoutParams);
    }

    if (this.params.animatedLayout.enabled) {
      let config = createAnimatedLayoutParams(
        this.params.animatedLayout.config,
      );

      if (this.params.userDraggableNodes.enabled) {
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

    canvas.onBeforeDestroy.subscribe(() => {
      layers.destroy();
    });

    return canvas;
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
