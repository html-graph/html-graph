export { CanvasBuilder } from "./canvas-builder";
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
  VirtualScrollConfig,
} from "./canvas-builder";

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
  GraphNode,
  GraphPort,
  GraphEdge,
  Graph,
  Viewport,
} from "./canvas";

export type {
  NodeDragPayload,
  TransformPayload,
  TransformPreprocessorFn,
  TransformPreprocessorParams,
  ConnectionPreprocessor,
  ConnectionTypeResolver,
  MouseEventVerifier,
  DraggingEdgeResolver,
} from "./configurators";

export {
  BezierEdgeShape,
  StraightEdgeShape,
  HorizontalEdgeShape,
  VerticalEdgeShape,
  InteractiveEdgeShape,
  InteractiveEdgeError,
  DirectEdgeShape,
  MidpointEdgeShape,
  /**
   * @deprecated
   * use MidpointEdgeShape instead
   */
  MidpointEdgeShape as MedianEdgeShape,
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
  ConnectionCategory,
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

export type { CenterFn } from "./center-fn";

export type { PriorityFn } from "./priority";

export { HtmlGraphError } from "./error";

/**
 * @deprecated
 * do not use
 */
export { EventSubject } from "./event-subject";
/**
 * @deprecated
 * do not use
 */
export type { EventEmitter, EventHandler } from "./event-subject";

/**
 * @deprecated
 * do not use
 */
export type { RenderingBox } from "./html-view";
