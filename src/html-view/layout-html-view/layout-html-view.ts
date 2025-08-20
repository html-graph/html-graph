import { HtmlView } from "../html-view";
import { Identifier } from "@/identifier";
/**
 * this entity should inform user if node coordinates are not set
 * and apply layout if so
 */
export class LayoutHtmlView implements HtmlView {
  public constructor(private readonly htmlView: HtmlView) {}

  public attachNode(nodeId: Identifier): void {
    this.htmlView.attachNode(nodeId);
  }

  public detachNode(nodeId: Identifier): void {
    this.htmlView.detachNode(nodeId);
  }

  public attachEdge(edgeId: Identifier): void {
    this.htmlView.attachEdge(edgeId);
  }

  public detachEdge(edgeId: Identifier): void {
    this.htmlView.detachEdge(edgeId);
  }

  public updateNodePosition(nodeId: Identifier): void {
    this.htmlView.updateNodePosition(nodeId);
  }

  public updateNodePriority(nodeId: Identifier): void {
    this.htmlView.updateNodePriority(nodeId);
  }

  public updateEdgeShape(edgeId: Identifier): void {
    this.htmlView.updateEdgeShape(edgeId);
  }

  public renderEdge(edgeId: Identifier): void {
    this.htmlView.renderEdge(edgeId);
  }

  public updateEdgePriority(edgeId: Identifier): void {
    this.htmlView.updateEdgePriority(edgeId);
  }

  public clear(): void {
    this.htmlView.clear();
  }

  public destroy(): void {
    this.htmlView.destroy();
  }
}
