import { Graph } from "@/graph";
import { Point } from "@/point";

export interface QuadTreeParams {
  readonly graph: Graph;
  readonly center: Point;
  readonly mass: number;
  readonly areaContainingRadius: {
    readonly horizontal: number;
    readonly vertical: number;
  };
}
