import { Identifier } from "@/identifier";
import { Point } from "@/point";
import { AnimatedLayoutAlgorithm } from "../animated-layout-algorithm";
import { Graph } from "@/graph";
import {
  createCurrentCoordinates,
  PhysicalSimulationIteration,
} from "../../shared";
import { ForceDirectedAnimatedLayoutAlgorithmParams } from "./force-directed-animated-layout-algorithm-params";

export class ForceDirectedAnimatedLayoutAlgorithm
  implements AnimatedLayoutAlgorithm
{
  public constructor(
    private readonly params: ForceDirectedAnimatedLayoutAlgorithmParams,
  ) {}

  public calculateNextCoordinates(
    graph: Graph,
    dtSec: number,
  ): ReadonlyMap<Identifier, Point> {
    if (dtSec > this.params.maxTimeDeltaSec) {
      return new Map();
    }

    const currentCoords = createCurrentCoordinates(graph, this.params.rand);

    const iteration = new PhysicalSimulationIteration(graph, currentCoords, {
      rand: this.params.rand,
      dtSec,
      nodeMass: this.params.nodeMass,
      nodeCharge: this.params.nodeCharge,
      edgeEquilibriumLength: this.params.edgeEquilibriumLength,
      effectiveDistance: this.params.effectiveDistance,
      edgeStiffness: this.params.edgeStiffness,
    });

    iteration.next();

    return currentCoords;
  }
}
