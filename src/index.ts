export { CanvasBuilder } from "./canvas-builder";

export type {
  Canvas,
  AddNodeRequest,
  AddEdgeRequest,
  AddNodePorts,
  MarkNodePortRequest,
  MarkPortRequest,
  UpdateNodeRequest,
  UpdatePortRequest,
  UpdateEdgeRequest,
  PatchMatrixRequest,
} from "./canvas";

export type {
  CanvasDefaults,
  BackgroundConfig,
  /**
   * @deprecated
   * use ConnectablePortsConfig instead
   */
  ConnectablePortsConfig as ConnectablePortsOptions,
  ConnectablePortsConfig,
  /**
   * @deprecated
   * use DraggableNodesConfig instead
   */
  DraggableNodesConfig as DragOptions,
  DraggableNodesConfig,
  ViewportTransformConfig,
  /**
   * @deprecated
   * use ViewportTransformConfig instead
   */
  ViewportTransformConfig as TransformOptions,
  ShiftLimitPreprocessorParams,
  ScaleLimitPreprocessorParams,
} from "./create-params";

export type {
  NodeDragPayload,
  TransformPayload,
  TransformPreprocessorFn,
  TransformPreprocessorParams,
  VirtualScrollConfig,
  ConnectionPreprocessor,
  ConnectionTypeResolver,
  MouseEventVerifier,
} from "./configurators";

export {
  BezierEdgeShape,
  StraightEdgeShape,
  HorizontalEdgeShape,
  VerticalEdgeShape,
  InteractiveEdgeShape,
  InteractiveEdgeError,
  DirectEdgeShape,
  MedianEdgeShape,
} from "./edges";
export type {
  EdgeShape,
  EdgeRenderParams,
  EdgeRenderPort,
  BezierEdgeParams,
  HorizontalEdgeParams,
  VerticalEdgeParams,
  StraightEdgeParams,
  InteractiveEdgeParams,
  DirectEdgeParams,
  StructuredEdgeShape,
  StructuredEdgeRenderModel,
} from "./edges";

/**
 * @deprecated
 * create your own implementation instead
 */
export { PathEdgeShape as LineEdgeShape } from "./edges/path-edge-shape";
/**
 * @deprecated
 * create your own implementation instead
 */
export type { PathEdgeParams as LineEdgeParams } from "./edges/path-edge-shape";

export type { Point } from "./point";

export type { GraphNode, GraphPort, GraphEdge, Graph } from "./graph";

export type { Viewport } from "./viewport";

export type { CenterFn } from "./center-fn";

export type { PriorityFn } from "./priority";

export { HtmlGraphError } from "./error";

export { EventSubject } from "./event-subject";
export type { EventEmitter, EventHandler } from "./event-subject";

export type { RenderingBox } from "./html-view";
