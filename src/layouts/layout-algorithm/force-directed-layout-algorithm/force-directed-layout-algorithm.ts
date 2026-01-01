import { Graph } from "@/graph";
import { Identifier } from "@/identifier";
import { Point } from "@/point";
import { LayoutAlgorithm } from "../layout-algorithm";
import { ForceDirectedLayoutAlgorithmParams } from "./force-directed-layout-algorithm-params";
import {
  createCurrentCoordinates,
  ForceDirectedAlgorithmIteration,
} from "../../shared";

export class ForceDirectedLayoutAlgorithm implements LayoutAlgorithm {
  public constructor(
    private readonly params: ForceDirectedLayoutAlgorithmParams,
  ) {}

  public calculateCoordinates(graph: Graph): ReadonlyMap<Identifier, Point> {
    const currentCoords = createCurrentCoordinates(
      graph,
      this.params.rand,
      this.params.edgeEquilibriumLength,
    );

    for (let i = 0; i < this.params.maxIterations; i++) {
      const iteration = new ForceDirectedAlgorithmIteration(
        graph,
        currentCoords,
        {
          rand: this.params.rand,
          dtSec: this.params.dtSec,
          nodeMass: this.params.nodeMass,
          nodeCharge: this.params.nodeCharge,
          edgeEquilibriumLength: this.params.edgeEquilibriumLength,
          effectiveDistance: this.params.effectiveDistance,
          edgeStiffness: this.params.edgeStiffness,
        },
      );

      const maxDelta = iteration.next();

      if (maxDelta < this.params.convergenceDelta) {
        break;
      }
    }

    return currentCoords;
  }
}
