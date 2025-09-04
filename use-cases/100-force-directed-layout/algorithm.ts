import { Graph, Identifier } from "@html-graph/html-graph";
import { MutablePoint } from "./mutable-point";

export class AlgorithmIteration {
  public constructor(
    private readonly graph: Graph,
    private readonly coords: Map<Identifier, MutablePoint>,
  ) {}

  public updateCoordinates(): void {
    console.log(this.graph, this.coords);
  }
}
