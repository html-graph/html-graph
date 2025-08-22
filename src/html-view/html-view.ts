import { Identifier } from "@/identifier";

export interface HtmlView {
  attachNode(nodeId: Identifier): void;

  detachNode(nodeId: Identifier): void;

  attachEdge(edgeId: Identifier): void;

  detachEdge(edgeId: Identifier): void;

  updateNodePosition(nodeId: Identifier): void;

  updateNodePriority(nodeId: Identifier): void;

  updateEdgeShape(edgeId: Identifier): void;

  renderEdge(edgeId: Identifier): void;

  updateEdgePriority(edgeId: Identifier): void;

  clear(): void;

  destroy(): void;
}
