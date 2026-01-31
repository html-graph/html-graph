import { Point } from "@/point";

export interface HierarchicalLayoutAlgorithmParams {
  readonly layerWidth: number;
  readonly layerSpace: number;
  readonly transform: (point: Point) => Point;
}
