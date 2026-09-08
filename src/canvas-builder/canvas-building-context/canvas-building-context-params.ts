import { AnimatedLayoutConfig } from "../create-animated-layout-params";
import { BackgroundConfig } from "../create-background-params";
import { ConnectablePortsConfig } from "../create-connectable-ports-params";
import { DraggableEdgesConfig } from "../create-draggable-edges-params";
import { DraggableNodesConfig } from "../create-draggable-nodes-params";
import { LayoutConfig } from "../create-layout-params";
import { RectangularSelectionConfig } from "../create-rectangular-selection-params";
import { ViewportTransformConfig } from "../create-transformable-viewport-params";
import { UserSelectableCanvasConfig } from "../create-user-selectable-canvas-params";
import { UserSelectableEdgesConfig } from "../create-user-selectable-edges-params";
import { UserSelectableNodesConfig } from "../create-user-selectable-nodes-params";
import { VirtualScrollConfig } from "../create-virtual-scroll-params";
import { CanvasDefaults } from "../shared";

export interface CanvasBuildingContextParams {
  readonly canvasDefaults: CanvasDefaults;

  readonly draggableNodes: {
    readonly enabled: boolean;
    readonly config: DraggableNodesConfig | undefined;
  };

  readonly transformableViewport: {
    readonly enabled: boolean;
    readonly config: ViewportTransformConfig | undefined;
  };

  readonly background: {
    readonly enabled: boolean;
    readonly config: BackgroundConfig | undefined;
  };

  readonly connectablePorts: {
    readonly enabled: boolean;
    readonly config: ConnectablePortsConfig | undefined;
  };

  readonly draggableEdges: {
    readonly enabled: boolean;
    readonly config: DraggableEdgesConfig | undefined;
  };

  readonly rectangularSelection: {
    readonly enabled: boolean;
    readonly config: RectangularSelectionConfig | undefined;
  };

  readonly virtualScroll:
    | {
        readonly enabled: true;
        readonly config: VirtualScrollConfig;
      }
    | {
        readonly enabled: false;
      };

  readonly layout: {
    readonly enabled: boolean;
    readonly config: LayoutConfig | undefined;
  };

  readonly animatedLayout: {
    readonly enabled: boolean;
    readonly config: AnimatedLayoutConfig | undefined;
  };

  readonly nodeResizeReactiveEdges: {
    readonly enabled: boolean;
  };

  readonly userSelectableNodes:
    | {
        readonly enabled: true;
        readonly config: UserSelectableNodesConfig;
      }
    | {
        readonly enabled: false;
      };

  readonly userSelectableEdges:
    | {
        readonly enabled: true;
        readonly config: UserSelectableEdgesConfig;
      }
    | {
        readonly enabled: false;
      };

  readonly userSelectableCanvas:
    | {
        readonly enabled: true;
        readonly config: UserSelectableCanvasConfig;
      }
    | {
        readonly enabled: false;
      };
}
