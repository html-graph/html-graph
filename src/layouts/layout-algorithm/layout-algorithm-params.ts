import { Graph } from "@/graph";
import { Viewport } from "@/viewport";

export interface LayoutAlgorithmParams {
  readonly graph: Graph;
  readonly viewport: Viewport;
}
