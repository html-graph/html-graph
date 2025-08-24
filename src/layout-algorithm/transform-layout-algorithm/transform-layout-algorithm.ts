import { Identifier } from "@/identifier";
import { LayoutAlgorithm } from "../layout-algorithm";
import { TransformationMatrix } from "./transformation-matrix";
import { Point } from "@/point";
import { Graph } from "@/graph";

export class TransformLayoutAlgorithm implements LayoutAlgorithm {
  public constructor(
    private params: {
      readonly baseAlgorithm: LayoutAlgorithm;
      readonly matrix: TransformationMatrix;
    },
  ) {}

  public calculateCoordinates(graph: Graph): ReadonlyMap<Identifier, Point> {
    const baseCoords = this.params.baseAlgorithm.calculateCoordinates(graph);
    const coords = new Map<Identifier, Point>();
    const m = this.params.matrix;

    baseCoords.forEach(({ x, y }, nodeId) => {
      coords.set(nodeId, {
        x: m.a * x + m.b * y + m.c,
        y: m.d * x + m.e * y + m.f,
      });
    });

    return coords;
  }
}
