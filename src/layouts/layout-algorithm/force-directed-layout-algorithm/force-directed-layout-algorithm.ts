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
  private readonly distance: DistanceVectorGenerator;

  private readonly nodeForcesApplicationStrategy: NodeForcesApplicationStrategy;

  public constructor(
    private readonly params: ForceDirectedLayoutAlgorithmParams,
  ) {
    this.distance = new DistanceVectorGenerator(this.params.rand);

    this.nodeForcesApplicationStrategy = resolveNodeForcesApplicationStrategy({
      distance: this.distance,
      nodeCharge: this.params.nodeCharge,
      effectiveDistance: this.params.effectiveDistance,
      maxForce: this.params.maxForce,
      nodeForceCoefficient: this.params.nodeForceCoefficient,
      theta: this.params.barnesHutTheta,
      minAreaSize: this.params.barnesHutMinAreaSize,
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
          distance: this.distance,
          nodeForcesApplicationStrategy: this.nodeForcesApplicationStrategy,
          dtSec: this.params.dtSec,
          nodeMass: this.params.nodeMass,
          edgeEquilibriumLength: this.params.edgeEquilibriumLength,
          edgeStiffness: this.params.edgeStiffness,
        },
      );

      const maxDelta = iteration.apply();

      if (maxDelta < this.params.convergenceDelta) {
        break;
      }
    }

    return currentCoords;
  }
}
