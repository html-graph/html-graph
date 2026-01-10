import { Graph } from "@/graph";
import { Identifier } from "@/identifier";
import { Point } from "@/point";
import { LayoutAlgorithm } from "../layout-algorithm";
import { ForceDirectedLayoutAlgorithmParams } from "./force-directed-layout-algorithm-params";
import {
  DistanceVectorGenerator,
  ForceDirectedAlgorithmIteration,
  NodeForcesApplicationStrategy,
  resolveNodeForcesApplicationStrategy,
} from "../../shared";
import { RandomFillerLayoutAlgorithm } from "../random-filler-layout-algorithm";

export class ForceDirectedLayoutAlgorithm implements LayoutAlgorithm {
  private readonly distanceVectorGenerator: DistanceVectorGenerator;

  private readonly nodeForcesApplicationStrategy: NodeForcesApplicationStrategy;

  private readonly fillerLayout: LayoutAlgorithm;

  private readonly maxIterations: number;

  private readonly dtSec: number;

  private readonly nodeMass: number;

  private readonly edgeEquilibriumLength: number;

  private readonly edgeStiffness: number;

  private readonly convergenceDelta: number;

  private readonly convergenceVelocity: number;

  public constructor(params: ForceDirectedLayoutAlgorithmParams) {
    this.maxIterations = params.maxIterations;
    this.dtSec = params.dtSec;
    this.nodeMass = params.nodeMass;
    this.edgeEquilibriumLength = params.edgeEquilibriumLength;
    this.edgeStiffness = params.edgeStiffness;
    this.convergenceDelta = params.convergenceDelta;
    this.convergenceVelocity = params.convergenceVelocity;

    this.distanceVectorGenerator = new DistanceVectorGenerator(params.rand);

    this.nodeForcesApplicationStrategy = resolveNodeForcesApplicationStrategy({
      distanceVectorGenerator: this.distanceVectorGenerator,
      nodeCharge: params.nodeCharge,
      effectiveDistance: params.effectiveDistance,
      maxForce: params.maxForce,
      nodeForceCoefficient: params.nodeForceCoefficient,
      theta: params.barnesHutTheta,
      areaRadiusThreshold: params.barnesHutAreaRadiusThreshold,
      nodeMass: params.nodeMass,
    });

    this.fillerLayout = new RandomFillerLayoutAlgorithm({
      rand: params.rand,
      sparsity: params.edgeEquilibriumLength,
    });
  }

  public calculateCoordinates(graph: Graph): ReadonlyMap<Identifier, Point> {
    const currentCoords = this.fillerLayout.calculateCoordinates(graph);

    for (let i = 0; i < this.maxIterations; i++) {
      const iteration = new ForceDirectedAlgorithmIteration(
        graph,
        currentCoords,
        {
          distanceVectorGenerator: this.distanceVectorGenerator,
          nodeForcesApplicationStrategy: this.nodeForcesApplicationStrategy,
          dtSec: this.dtSec,
          nodeMass: this.nodeMass,
          edgeEquilibriumLength: this.edgeEquilibriumLength,
          edgeStiffness: this.edgeStiffness,
        },
      );

      const [maxDelta, maxVelocity] = iteration.apply();

      if (maxDelta < this.convergenceDelta) {
        break;
      }

      if (maxVelocity < this.convergenceVelocity) {
        break;
      }
    }

    return currentCoords;
  }
}
