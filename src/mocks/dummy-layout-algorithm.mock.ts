import { Graph } from "@/graph";
import { Identifier } from "@/identifier";
import { LayoutAlgorithm } from "@/layouts";
import { Point } from "@/point";

export class DummyLayoutAlgorithm implements LayoutAlgorithm {
  public calculateCoordinates(graph: Graph): ReadonlyMap<Identifier, Point> {
    const result = new Map<Identifier, Point>();

    graph.getAllNodeIds().forEach((nodeId) => {
      result.set(nodeId, { x: 0, y: 0 });
    });

    return result;
  }
}
