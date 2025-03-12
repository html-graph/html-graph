import { HtmlController } from "../html-controller";

/**
 * This entity is responsible for HTML modifications regarding for viewport
 */
export class VirtualScrollHtmlController implements HtmlController {
  public constructor(private readonly htmlController: HtmlController) {}

  public attach(canvasWrapper: HTMLElement): void {
    this.htmlController.attach(canvasWrapper);
  }

  public detach(): void {
    this.htmlController.detach();
  }

  public attachNode(nodeId: unknown): void {
    this.htmlController.attachNode(nodeId);
  }

  public detachNode(nodeId: unknown): void {
    this.htmlController.detachNode(nodeId);
  }

  public attachEdge(edgeId: unknown): void {
    this.htmlController.attachEdge(edgeId);
  }

  public detachEdge(edgeId: unknown): void {
    this.htmlController.detachEdge(edgeId);
  }

  public clear(): void {
    this.htmlController.clear();
  }

  public destroy(): void {
    this.htmlController.destroy();
  }

  public updateNodeCoordinates(nodeId: unknown): void {
    this.htmlController.updateNodeCoordinates(nodeId);
  }

  public updateNodePriority(nodeId: unknown): void {
    this.htmlController.updateNodePriority(nodeId);
  }

  public updateEdgeShape(edgeId: unknown): void {
    this.htmlController.updateEdgeShape(edgeId);
  }

  public renderEdge(edgeId: unknown): void {
    this.htmlController.renderEdge(edgeId);
  }

  public updateEdgePriority(edgeId: unknown): void {
    this.htmlController.updateEdgePriority(edgeId);
  }
}
