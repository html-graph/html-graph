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
    const payload = this.graphStore.getNode(nodeId)!.payload;

    return (
      payload.x >= this.xFrom &&
      payload.x <= this.xTo &&
      payload.y >= this.yFrom &&
      payload.y <= this.yTo
    );
  }

  public hasEdge(edgeId: unknown): boolean {
    const edge = this.graphStore.getEdge(edgeId)!;
    const nodeFromId = this.graphStore.getPort(edge.from)!.nodeId;
    const nodeToId = this.graphStore.getPort(edge.to)!.nodeId;
    const nodePayloadFrom = this.graphStore.getNode(nodeFromId)!.payload;
    const nodePayloadTo = this.graphStore.getNode(nodeToId)!.payload;

    const xFrom = Math.min(nodePayloadFrom.x, nodePayloadTo.x);
    const xTo = Math.max(nodePayloadFrom.x, nodePayloadTo.x);
    const yFrom = Math.min(nodePayloadFrom.y, nodePayloadTo.y);
    const yTo = Math.max(nodePayloadFrom.y, nodePayloadTo.y);

    return (
      xFrom <= this.xTo &&
      xTo >= this.xFrom &&
      yFrom <= this.yTo &&
      yTo >= this.yFrom
    );
  }
}
