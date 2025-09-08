import { Graph, Identifier } from "@html-graph/html-graph";
import { MutablePoint } from "./mutable-point";

export class PhysicalSimulationIteration {
  public constructor(
    private readonly graph: Graph,
    private readonly coords: Map<Identifier, MutablePoint>,
    private readonly velociies: Map<Identifier, MutablePoint>,
    private readonly dt: number,
  ) {}

  public next(): void {
    console.log(this.graph, this.coords, this.velociies, this.dt);
  }
}
