export interface HtmlController {
  clear(): void;

  attach(canvasWrapper: HTMLElement): void;

  detach(): void;

  destroy(): void;

  applyTransform(): void;

  attachNode(nodeId: unknown): void;

  detachNode(nodeId: unknown): void;

  attachEdge(edgeId: unknown): void;

  detachEdge(edgeId: unknown): void;

  updateNodePriority(nodeId: unknown): void;

  updateEdgePriority(edgeId: unknown): void;

  updateNodeCoordinates(nodeId: unknown): void;

  updatePortEdges(portId: unknown): void;
}
