export { CanvasBuilder } from "./canvas-builder";

export {
  /**
   * @deprecated
   * use CanvasBuilder instead
   */
  CanvasBuilder as HtmlGraphBuilder,
} from "./canvas-builder";

export {
  /**
   * @deprecated
   * use CanvasBuilder build method instead
   */
  CanvasCore,
  /**
   * @deprecated
   * use CanvasBuilder build method instead
   */
  UserDraggableNodesCanvas,
  /**
   * @deprecated
   * use CanvasBuilder build method instead
   */
  UserTransformableViewportCanvas,
  /**
   * @deprecated
   * use CanvasBuilder build method instead
   */
  ResizeReactiveNodesCanvas,
} from "./canvas";

export {
  /**
   * @deprecated
   * use UserTransformableViewportCanvas instead
   */
  UserTransformableViewportCanvas as UserTransformableCanvas,
} from "./canvas";

export type {
  Canvas,
  CoreOptions,
  TransformOptions,
  DragOptions,
  AddEdgeRequest,
  UpdateEdgeRequest,
  PatchMatrixRequest,
  MarkPortRequest,
  AddNodeRequest,
  MarkNodePortRequest,
  NodeDragPayload,
  TransformPayload,
  AddNodePorts,
  TransformPreprocessorFn,
  ShiftLimitPreprocessorParams,
  ScaleLimitPreprocessorParams,
  TransformPreprocessorParams,
  UpdatePortRequest,
  UpdateNodeRequest,
} from "./canvas";

export {
  BezierEdgeShape,
  StraightEdgeShape,
  HorizontalEdgeShape,
  VerticalEdgeShape,
} from "./edges";
export type {
  EdgeShape,
  EdgeRenderParams,
  EdgeRenderPort,
  BezierEdgeParams,
  HorizontalEdgeParams,
  VerticalEdgeParams,
  StraightEdgeParams,
} from "./edges";

export type { Point } from "./point";

export type {
  GraphNode,
  GraphPort,
  GraphEdge,
  Graph,
  /**
   * @deprecated
   * use Graph instead
   */
  Graph as PublicGraphStore,
} from "./graph";

export type {
  Viewport,
  /**
   * @deprecated
   * use Viewport instead
   */
  Viewport as PublicViewportTransformer,
} from "./viewport-transformer";

export type { CenterFn } from "./center-fn";

export type { PriorityFn } from "./priority";

export { HtmlGraphError } from "./error";

export { EventSubject } from "./event-subject";

export type { RenderingBox } from "./html-view";
