import { Graph } from "@/graph";
import { Identifier } from "@/identifier";
import { Point } from "@/point";
import { LayoutAlgorithm } from "../layout-algorithm";
import { CellularLayoutAlgorithmParams } from "./cellular-layout-algorithm-params";

export class CellularLayoutAlgorithm implements LayoutAlgorithm {
  public constructor(private readonly params: CellularLayoutAlgorithmParams) {}

  public calculateCoordinates(graph: Graph): ReadonlyMap<Identifier, Point> {
    const result = new Map<Identifier, Point>();
    let i = 0;

    graph.getAllNodeIds().forEach((nodeId) => {
      result.set(nodeId, { x: i * this.params.edgeLength, y: 0 });
      i++;
    });

    return result;
  }
}
