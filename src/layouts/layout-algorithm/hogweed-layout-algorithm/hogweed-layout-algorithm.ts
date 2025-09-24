import { Graph } from "@/graph";
import { Identifier } from "@/identifier";
import { Point } from "@/point";
import { LayoutAlgorithm } from "../layout-algorithm";

export class HogweedLayoutAlgorithm implements LayoutAlgorithm {
  public calculateCoordinates(graph: Graph): ReadonlyMap<Identifier, Point> {
    console.log(graph);

    // sort nodes by most adjacent connections
    // formate clicks
    throw new Error("Method not implemented.");
  }
}
