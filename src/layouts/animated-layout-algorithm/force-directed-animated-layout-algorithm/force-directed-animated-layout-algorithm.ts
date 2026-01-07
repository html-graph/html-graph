import { Identifier } from "@/identifier";
import { Point } from "@/point";
import { AnimatedLayoutAlgorithm } from "../animated-layout-algorithm";
import { Graph } from "@/graph";
import {
  createCurrentCoordinates,
  DirectSumNodeForcesApplicationStrategy,
  DistanceVectorGenerator,
  ForceDirectedAlgorithmIteration,
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
    const currentCoords = createCurrentCoordinates(
      graph,
      this.params.rand,
      this.params.edgeEquilibriumLength,
    );

    const distance = new DistanceVectorGenerator(this.params.rand);

    const iteration = new ForceDirectedAlgorithmIteration(
      graph,
      currentCoords,
      {
        distance,
        nodeForcesApplicationStrategy:
          new DirectSumNodeForcesApplicationStrategy({
            nodeCharge: this.params.nodeCharge,
            effectiveDistance: this.params.effectiveDistance,
            distance,
          }),
        dtSec: Math.min(dtSec, this.params.maxTimeDeltaSec),
        nodeMass: this.params.nodeMass,
        edgeEquilibriumLength: this.params.edgeEquilibriumLength,
        effectiveDistance: this.params.effectiveDistance,
        edgeStiffness: this.params.edgeStiffness,
      },
    );

    const maxDelta = iteration.apply();

    if (maxDelta < this.params.convergenceDelta) {
      const hasUnsetCoords = graph.getAllNodeIds().some((nodeId) => {
        const node = graph.getNode(nodeId)!;

        return node.x === null || node.y === null;
      });

      if (!hasUnsetCoords) {
        return new Map();
      }
    }

    return currentCoords;
  }
}
