import { Graph } from "@/graph";
import { Identifier } from "@/identifier";
import { Point } from "@/point";
import { Viewport } from "@/viewport";

export interface AnimatedLayoutAlgorithm {
  /**
   * TODO: v8
   * make single parameter object
   */
  calculateNextCoordinates(
    graph: Graph,
    dt: number,
    viewport: Viewport,
  ): ReadonlyMap<Identifier, Point>;
}
