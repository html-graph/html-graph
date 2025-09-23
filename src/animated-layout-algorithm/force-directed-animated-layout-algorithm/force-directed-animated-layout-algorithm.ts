import { Identifier } from "@/identifier";
import { Point } from "@/point";
import { AnimatedLayoutAlgorithm } from "../animated-layout-algorithm";
import { Graph } from "@/graph";
import { PhysicalSimulationIteration } from "./physical-simulation-iteration";
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

    const iteration = new PhysicalSimulationIteration(graph, {
      rand: this.params.rand,
      dtSec,
      nodeMass: this.params.nodeMass,
      nodeCharge: this.params.nodeCharge,
      edgeEquilibriumLength: this.params.edgeEquilibriumLength,
      effectiveDistance: this.params.effectiveDistance,
      edgeStiffness: this.params.edgeStiffness,
      xFallbackResolver: this.params.xFallbackResolver,
      yFallbackResolver: this.params.yFallbackResolver,
    });

    return iteration.calculateNextCoordinates();
  }
}
