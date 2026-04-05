import { Point } from "@/point";
import { NextLayerNodesResolver } from "./next-layer-nodes-resolver";

export interface HierarchicalLayoutAlgorithmParams {
  readonly layerWidth: number;
  readonly layerSpace: number;
  readonly transform: (point: Point) => Point;
  readonly nextLayerNodesResolver: NextLayerNodesResolver;
}
