import { Graph } from "@/graph";
import { Identifier } from "@/identifier";
import { Point } from "@/point";
import { Viewport } from "@/viewport";

export interface LayoutAlgorithm {
  /**
   * TODO: v8
   * make single parameter object
   */
  calculateCoordinates(
    graph: Graph,
    viewport: Viewport,
  ): ReadonlyMap<Identifier, Point>;
}
