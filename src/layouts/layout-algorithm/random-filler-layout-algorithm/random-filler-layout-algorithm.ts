import { Graph } from "@/graph";
import { Identifier } from "@/identifier";
import { LayoutAlgorithm } from "@/layouts/layout-algorithm";
import type { Point } from "@/point";
import { RandomFillerLayoutAlgorithmParams } from "./random-filler-layout-algorithm-params";

export class RandomFillerLayoutAlgorithm implements LayoutAlgorithm {
  private readonly rand: () => number;

  private readonly preferredEdgeLength: number;

  public constructor(params: RandomFillerLayoutAlgorithmParams) {
    this.rand = params.rand;
    this.preferredEdgeLength = params.preferredEdgeLength;
  }

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
