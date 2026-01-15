import { GraphStore } from "@/graph-store";
import { RenderingBox } from "../rendering-box";
import { Identifier } from "@/identifier";
import { Point } from "@/point";

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

  public hasNode(nodeId: Identifier): boolean {
    const payload = this.graphStore.getNode(nodeId).payload;

    const { x, y } = payload as Point;

    return x >= this.xFrom && x <= this.xTo && y >= this.yFrom && y <= this.yTo;
  }

  public hasEdge(edgeId: Identifier): boolean {
    const edge = this.graphStore.getEdge(edgeId)!;
    const nodeFromId = this.graphStore.getPort(edge.from)!.nodeId;
    const nodeToId = this.graphStore.getPort(edge.to)!.nodeId;
    const nodePayloadFrom = this.graphStore.getNode(nodeFromId)
      .payload as Point;
    const nodePayloadTo = this.graphStore.getNode(nodeToId).payload as Point;

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
