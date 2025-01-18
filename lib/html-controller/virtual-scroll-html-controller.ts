import { HtmlController } from "./html-controller";

export class VirtualScrollHtmlController implements HtmlController {
  public constructor(private readonly controller: HtmlController) {}

  public clear(): void {
    this.controller.clear();
  }

  public attach(canvasWrapper: HTMLElement): void {
    this.controller.attach(canvasWrapper);
  }

  public detach(): void {
    this.controller.detach();
  }

  public destroy(): void {
    this.controller.destroy();
  }

  public applyTransform(): void {
    this.controller.applyTransform();
  }

  public attachNode(nodeId: unknown): void {
    this.controller.attachNode(nodeId);
  }

  public detachNode(nodeId: unknown): void {
    this.controller.detachNode(nodeId);
  }

  public attachEdge(edgeId: unknown): void {
    this.controller.attachEdge(edgeId);
  }

  public detachEdge(edgeId: unknown): void {
    this.controller.detachEdge(edgeId);
  }

  public updateNodePriority(nodeId: unknown): void {
    this.controller.updateNodePriority(nodeId);
  }

  public updateEdgePriority(edgeId: unknown): void {
    this.controller.updateEdgePriority(edgeId);
  }

  public updateNodeCoordinates(nodeId: unknown): void {
    this.controller.updateNodeCoordinates(nodeId);
  }

  public updatePortEdges(portId: unknown): void {
    this.controller.updatePortEdges(portId);
  }
}
