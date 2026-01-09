import { Identifier } from "@/identifier";
import { Point } from "@/point";
import { AnimatedLayoutAlgorithm } from "../animated-layout-algorithm";
import { Graph } from "@/graph";
import {
  createCurrentCoordinates,
  DistanceVectorGenerator,
  ForceDirectedAlgorithmIteration,
  NodeForcesApplicationStrategy,
  resolveNodeForcesApplicationStrategy,
} from "../../shared";
import { ForceDirectedAnimatedLayoutAlgorithmParams } from "./force-directed-animated-layout-algorithm-params";

export class ForceDirectedAnimatedLayoutAlgorithm
  implements AnimatedLayoutAlgorithm
{
  private readonly distance: DistanceVectorGenerator;

  private readonly nodeForcesApplicationStrategy: NodeForcesApplicationStrategy;

  public constructor(
    private readonly params: ForceDirectedAnimatedLayoutAlgorithmParams,
  ) {
    this.distance = new DistanceVectorGenerator(params.rand);

    this.nodeForcesApplicationStrategy = resolveNodeForcesApplicationStrategy({
      distance: this.distance,
      nodeCharge: this.params.nodeCharge,
      effectiveDistance: this.params.effectiveDistance,
      maxForce: this.params.maxForce,
      nodeForceCoefficient: this.params.nodeForceCoefficient,
      theta: this.params.barnesHutTheta,
      areaRadiusThreshold: this.params.barnesHutMinAreaSize,
      nodeMass: this.params.nodeMass,
    });
  }

  public calculateNextCoordinates(
    graph: Graph,
    dtSec: number,
  ): ReadonlyMap<Identifier, Point> {
    const currentCoords = createCurrentCoordinates(
      graph,
      this.params.rand,
      this.params.edgeEquilibriumLength,
    );

    const iteration = new ForceDirectedAlgorithmIteration(
      graph,
      currentCoords,
      {
        distance: this.distance,
        nodeForcesApplicationStrategy: this.nodeForcesApplicationStrategy,
        dtSec: Math.min(dtSec, this.params.maxTimeDeltaSec),
        nodeMass: this.params.nodeMass,
        edgeEquilibriumLength: this.params.edgeEquilibriumLength,
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
