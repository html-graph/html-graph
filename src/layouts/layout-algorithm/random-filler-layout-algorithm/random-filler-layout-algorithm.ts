import { Graph } from "@/graph";
import { Identifier } from "@/identifier";
import { LayoutAlgorithm } from "@/layouts/layout-algorithm";
import type { Point } from "@/point";

export class RandomFillerLayoutAlgorithm implements LayoutAlgorithm {
  public constructor(
    private readonly rand: () => number,
    private readonly preferredEdgeLength: number,
  ) {}

  public calculateCoordinates(graph: Graph): ReadonlyMap<Identifier, Point> {
    const currentCoords = new Map<Identifier, Point>();
    const nodeIds = graph.getAllNodeIds();

    const side = Math.sqrt(nodeIds.length) * this.preferredEdgeLength;

    nodeIds.forEach((nodeId) => {
      const node = graph.getNode(nodeId)!;

      currentCoords.set(nodeId, {
        x: node.x ?? side * this.rand(),
        y: node.y ?? side * this.rand(),
      });
    });

    return currentCoords;
  }
}
