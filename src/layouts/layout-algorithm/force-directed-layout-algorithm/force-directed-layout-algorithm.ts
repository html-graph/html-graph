import { Graph } from "@/graph";
import { Identifier } from "@/identifier";
import { Point } from "@/point";
import { LayoutAlgorithm } from "../layout-algorithm";
import { ForceDirectedLayoutAlgorithmParams } from "./force-directed-layout-algorithm-params";
import {
  createCurrentCoordinates,
  DistanceVectorGenerator,
  ForceDirectedAlgorithmIteration,
  NodeForcesApplicationStrategy,
  resolveNodeForcesApplicationStrategy,
} from "../../shared";

export class ForceDirectedLayoutAlgorithm implements LayoutAlgorithm {
  private readonly distanceVectorGenerator: DistanceVectorGenerator;

  private readonly nodeForcesApplicationStrategy: NodeForcesApplicationStrategy;

  public constructor(
    private readonly params: ForceDirectedLayoutAlgorithmParams,
  ) {
    this.distanceVectorGenerator = new DistanceVectorGenerator(
      this.params.rand,
    );

    this.nodeForcesApplicationStrategy = resolveNodeForcesApplicationStrategy({
      distanceVectorGenerator: this.distanceVectorGenerator,
      nodeCharge: this.params.nodeCharge,
      effectiveDistance: this.params.effectiveDistance,
      maxForce: this.params.maxForce,
      nodeForceCoefficient: this.params.nodeForceCoefficient,
      theta: this.params.barnesHutTheta,
      areaRadiusThreshold: this.params.barnesHutAreaRadiusThreshold,
      nodeMass: this.params.nodeMass,
    });
  }

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
          distanceVectorGenerator: this.distanceVectorGenerator,
          nodeForcesApplicationStrategy: this.nodeForcesApplicationStrategy,
          dtSec: this.params.dtSec,
          nodeMass: this.params.nodeMass,
          edgeEquilibriumLength: this.params.edgeEquilibriumLength,
          edgeStiffness: this.params.edgeStiffness,
        },
      );

      const [maxDelta, maxVelocity] = iteration.apply();

      if (maxDelta < this.params.convergenceDelta) {
        break;
      }

      if (maxVelocity < this.params.convergenceVelocity) {
        break;
      }
    }

    return currentCoords;
  }
}
