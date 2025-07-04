// Responsibility: Provides access to DOM modifications
export interface HtmlView {
  attachNode(nodeId: unknown): void;

  detachNode(nodeId: unknown): void;

  attachEdge(edgeId: unknown): void;

  detachEdge(edgeId: unknown): void;

  clear(): void;

  destroy(): void;

  updateNodePosition(nodeId: unknown): void;

  updateNodePriority(nodeId: unknown): void;

  updateEdgeShape(edgeId: unknown): void;

  renderEdge(edgeId: unknown): void;

  updateEdgePriority(edgeId: unknown): void;
}
