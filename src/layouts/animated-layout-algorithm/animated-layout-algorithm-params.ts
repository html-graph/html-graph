import { Graph } from "@/graph";
import { Viewport } from "@/viewport";

export interface AnimatedLayoutAlgorithmParams {
  readonly graph: Graph;
  readonly dt: number;
  readonly viewport: Viewport;
}
