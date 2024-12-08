import { GraphStore } from "./graph-store";
import { NodeItem } from "./node-item";
import { NodeResponse } from "./node-response";

export class PublicGraphStore {
  public constructor(private readonly graphStore: GraphStore) {}

  public getNode(nodeId: string): NodeResponse | null {
    const node = this.graphStore.getNode(nodeId);

    if (node === undefined) {
      return null;
    }

    return { x: node.x, y: node.y, element: node.element };
  }

  public getAllNodes(): readonly NodeItem[] {
    return Object.entries(this.graphStore.getAllNodes()).map(
      ([key, value]) => ({
        id: key,
        x: value.x,
        y: value.y,
        element: value.element,
      }),
    );
  }
}
