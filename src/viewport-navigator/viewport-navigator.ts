import { Graph } from "@/graph";
import { Point } from "@/point";
import { TransformState } from "@/viewport-store";
import { Viewport } from "@/viewport/viewport";

export class ViewportNavigator {
  public constructor(
    private readonly viewport: Viewport,
    private readonly graph: Graph,
  ) {}

  public createFocusContentMatrix(): TransformState {
    let minX = Infinity;
    let maxX = -Infinity;
    let minY = Infinity;
    let maxY = -Infinity;
    let nodesCount = 0;

    this.graph.getAllNodeIds().forEach((nodeId) => {
      const node = this.graph.getNode(nodeId);

      if (node.x !== null && node.y !== null) {
        minX = Math.min(node.x, minX);
        maxX = Math.max(node.x, maxX);
        minY = Math.min(node.y, minY);
        maxY = Math.max(node.y, maxY);
        nodesCount++;
      }
    });

    if (nodesCount > 0) {
      const contentHalfWidth = (maxX - minX) / 2;
      const contentHalfHeight = (maxY - minY) / 2;

      const contentNodesCenter: Point = {
        x: contentHalfWidth,
        y: contentHalfHeight,
      };

      const viewportNodesCenter: Point =
        this.viewport.createViewportCoords(contentNodesCenter);

      const { width, height } = this.viewport.getDimensions();
      const { scale } = this.viewport.getContentMatrix();

      return {
        scale,
        x: width / 2 - viewportNodesCenter.x,
        y: height / 2 - viewportNodesCenter.y,
      };
    }

    return this.viewport.getContentMatrix();
  }
}
