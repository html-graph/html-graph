import { GraphStore } from "@/graph-store";
import { RenderingBox } from "../rendering-box";

export class RenderingBoxState {
  private xFrom = Infinity;

  private yFrom = Infinity;

  private xTo = Infinity;

  private yTo = Infinity;

  public constructor(private readonly graphStore: GraphStore) {}

  public setRenderingBox(renderingBox: RenderingBox): void {
    this.xFrom = renderingBox.x;
    this.xTo = renderingBox.x + renderingBox.width;
    this.yFrom = renderingBox.y;
    this.yTo = renderingBox.y + renderingBox.height;
  }

  public hasNode(nodeId: unknown): boolean {
    const node = this.graphStore.getNode(nodeId)!;

    return (
      node.x >= this.xFrom &&
      node.x <= this.xTo &&
      node.y >= this.yFrom &&
      node.y <= this.yTo
    );
  }

  public hasEdge(edgeId: unknown): boolean {
    const edge = this.graphStore.getEdge(edgeId)!;
    const nodeFromId = this.graphStore.getPort(edge.from)!.nodeId;
    const nodeToId = this.graphStore.getPort(edge.to)!.nodeId;
    const nodeFrom = this.graphStore.getNode(nodeFromId)!;
    const nodeTo = this.graphStore.getNode(nodeToId)!;

    const xFrom = Math.min(nodeFrom.x, nodeTo.x);
    const xTo = Math.max(nodeFrom.x, nodeTo.x);
    const yFrom = Math.min(nodeFrom.y, nodeTo.y);
    const yTo = Math.max(nodeFrom.y, nodeTo.y);

    return (
      xFrom <= this.xTo &&
      xTo >= this.xFrom &&
      yFrom <= this.yTo &&
      yTo >= this.yFrom
    );
  }
}
