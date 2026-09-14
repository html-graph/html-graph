import { Canvas } from "@/canvas";
import { DraggableNodesConfig } from "./create-draggable-nodes-params";
import { UserTransformableViewportConfig } from "./create-user-transformable-viewport-params";
import { BackgroundConfig } from "./create-background-params";
import { ConnectablePortsConfig } from "./create-connectable-ports-params";
import { DraggableEdgesConfig } from "./create-draggable-edges-params";
import { VirtualScrollConfig } from "./create-virtual-scroll-params";
import { CanvasBuilderError } from "./canvas-builder-error";
import { AnimatedLayoutConfig } from "./create-animated-layout-params";
import { LayoutConfig } from "./create-layout-params";
import { CanvasDefaults } from "./shared";
import { UserSelectableNodesConfig } from "./create-user-selectable-nodes-params";
import { UserSelectableCanvasConfig } from "./create-user-selectable-canvas-params";
import { UserSelectableEdgesConfig } from "./create-user-selectable-edges-params";
import { RectangularSelectionConfig } from "./create-rectangular-selection-params";
import {
  CanvasBuildingContext,
  CanvasBuildingContextParams,
} from "./canvas-building-context";

export class CanvasBuilder {
  private used = false;

  private canvasDefaults: CanvasDefaults = {};

  private draggableNodesConfig: DraggableNodesConfig | undefined = undefined;

  private userTransformableViewportConfig:
    | UserTransformableViewportConfig
    | undefined = undefined;

  private backgroundConfig: BackgroundConfig | undefined = undefined;

  private userConnectablePortsConfig: ConnectablePortsConfig | undefined =
    undefined;

  private userDraggableEdgesConfig: DraggableEdgesConfig | undefined =
    undefined;

  private rectangularSelectionConfig: RectangularSelectionConfig | undefined =
    undefined;

  private virtualScrollConfig: VirtualScrollConfig | undefined = undefined;

  private layoutConfig: LayoutConfig | undefined = undefined;

  private animatedLayoutConfig: AnimatedLayoutConfig | undefined = undefined;

  private userSelectableNodesConfig: UserSelectableNodesConfig | undefined =
    undefined;

  private userSelectableEdgesConfig: UserSelectableEdgesConfig | undefined =
    undefined;

  private userSelectableCanvasConfig: UserSelectableCanvasConfig | undefined =
    undefined;

  private hasDraggableNodes = false;

  private hasUserTransformableViewport = false;

  private hasNodeResizeReactiveEdges = false;

  private hasBackground = false;

  private hasUserConnectablePorts = false;

  private hasUserDraggableEdges = false;

  private hasRectangularSelection = false;

  private hasAnimatedLayout = false;

  private hasLayout = false;

  public constructor(private readonly element: HTMLElement) {}

  public setDefaults(defaults: CanvasDefaults): CanvasBuilder {
    this.canvasDefaults = defaults;

    return this;
  }

  public enableUserDraggableNodes(
    config?: DraggableNodesConfig | undefined,
  ): CanvasBuilder {
    this.hasDraggableNodes = true;
    this.draggableNodesConfig = config;

    return this;
  }

  public enableUserTransformableViewport(
    config?: UserTransformableViewportConfig | undefined,
  ): CanvasBuilder {
    this.hasUserTransformableViewport = true;
    this.userTransformableViewportConfig = config;

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
    this.backgroundConfig = config;

    return this;
  }

  public enableUserConnectablePorts(
    config?: ConnectablePortsConfig | undefined,
  ): CanvasBuilder {
    this.hasUserConnectablePorts = true;
    this.userConnectablePortsConfig = config;

    return this;
  }

  public enableUserDraggableEdges(
    config?: DraggableEdgesConfig | undefined,
  ): CanvasBuilder {
    this.hasUserDraggableEdges = true;
    this.userDraggableEdgesConfig = config;

    return this;
  }

  public enableRectangularSelection(
    config?: RectangularSelectionConfig | undefined,
  ): CanvasBuilder {
    this.hasRectangularSelection = true;
    this.rectangularSelectionConfig = config;

    return this;
  }

  public enableLayout(config?: LayoutConfig | undefined): CanvasBuilder {
    this.layoutConfig = config;
    this.hasLayout = true;
    this.hasAnimatedLayout = false;

    return this;
  }

  public enableAnimatedLayout(
    config?: AnimatedLayoutConfig | undefined,
  ): CanvasBuilder {
    this.animatedLayoutConfig = config;
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

  public enableUserSelectableEdges(
    config: UserSelectableEdgesConfig,
  ): CanvasBuilder {
    this.userSelectableEdgesConfig = config;

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

    const contextParams: CanvasBuildingContextParams = {
      canvasDefaults: this.canvasDefaults,
      draggableNodes: {
        enabled: this.hasDraggableNodes,
        config: this.draggableNodesConfig,
      },
      userTransformableViewport: {
        enabled: this.hasUserTransformableViewport,
        config: this.userTransformableViewportConfig,
      },
      background: {
        enabled: this.hasBackground,
        config: this.backgroundConfig,
      },
      userConnectablePorts: {
        enabled: this.hasUserConnectablePorts,
        config: this.userConnectablePortsConfig,
      },
      userDraggableEdges: {
        enabled: this.hasUserDraggableEdges,
        config: this.userDraggableEdgesConfig,
      },
      rectangularSelection: {
        enabled: this.hasRectangularSelection,
        config: this.rectangularSelectionConfig,
      },
      virtualScroll:
        this.virtualScrollConfig !== undefined
          ? {
              enabled: true,
              config: this.virtualScrollConfig,
            }
          : { enabled: false },
      layout: {
        enabled: this.hasLayout,
        config: this.layoutConfig,
      },
      animatedLayout: {
        enabled: this.hasAnimatedLayout,
        config: this.animatedLayoutConfig,
      },
      nodeResizeReactiveEdges: {
        enabled: this.hasNodeResizeReactiveEdges,
      },
      userSelectableNodes:
        this.userSelectableNodesConfig !== undefined
          ? {
              enabled: true,
              config: this.userSelectableNodesConfig,
            }
          : { enabled: false },
      userSelectableEdges:
        this.userSelectableEdgesConfig !== undefined
          ? {
              enabled: true,
              config: this.userSelectableEdgesConfig,
            }
          : { enabled: false },
      userSelectableCanvas:
        this.userSelectableCanvasConfig !== undefined
          ? {
              enabled: true,
              config: this.userSelectableCanvasConfig,
            }
          : { enabled: false },
    };

    const context = new CanvasBuildingContext(this.element, contextParams);

    return context.canvas;
  }
}
