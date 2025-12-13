import { Graph } from "@/graph";
import { Identifier } from "@/identifier";
import { Point } from "@/point";

export interface LayoutAlgorithm {
  calculateCoordinates(graph: Graph): ReadonlyMap<Identifier, Point>;
}
