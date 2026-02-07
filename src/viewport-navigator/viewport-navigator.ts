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
      const contentBoxCenter: Point = {
        x: (minX + maxX) / 2,
        y: (minY + maxY) / 2,
      };

      const viewportBoxCenter =
        this.viewport.createViewportCoords(contentBoxCenter);

      const { width, height } = this.viewport.getDimensions();
      const { scale, x, y } = this.viewport.getContentMatrix();

      const dx = width / 2 - viewportBoxCenter.x;
      const dy = height / 2 - viewportBoxCenter.y;

      return {
        scale,
        x: x + dx,
        y: y + dy,
      };
    }

    return this.viewport.getContentMatrix();
  }
}
