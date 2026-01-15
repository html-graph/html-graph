import { Identifier } from "@/identifier";
import { Point } from "@/point";
import { AnimatedLayoutAlgorithm } from "../animated-layout-algorithm";
import {
  DistanceVectorGenerator,
  ForceDirectedAlgorithmIteration,
  NodeForcesApplicationStrategy,
  resolveNodeForcesApplicationStrategy,
} from "../../shared";
import { ForceDirectedAnimatedLayoutAlgorithmParams } from "./force-directed-animated-layout-algorithm-params";
import {
  LayoutAlgorithm,
  RandomFillerLayoutAlgorithm,
} from "../../layout-algorithm";
import { AnimatedLayoutAlgorithmParams } from "../animated-layout-algorithm-params";

export class ForceDirectedAnimatedLayoutAlgorithm
  implements AnimatedLayoutAlgorithm
{
  private readonly distanceVectorGenerator: DistanceVectorGenerator;

  private readonly nodeForcesApplicationStrategy: NodeForcesApplicationStrategy;

  private readonly convergenceVelocity: number;

  private readonly maxTimeDeltaSec: number;

  private readonly nodeMass: number;

  private readonly edgeEquilibriumLength: number;

  private readonly edgeStiffness: number;

  private readonly fillerLayoutAlgorithm: LayoutAlgorithm;

  public constructor(params: ForceDirectedAnimatedLayoutAlgorithmParams) {
    this.convergenceVelocity = params.convergenceVelocity;
    this.maxTimeDeltaSec = params.maxTimeDeltaSec;
    this.nodeMass = params.nodeMass;
    this.edgeEquilibriumLength = params.edgeEquilibriumLength;
    this.edgeStiffness = params.edgeStiffness;

    this.distanceVectorGenerator = new DistanceVectorGenerator(params.rand);

    this.nodeForcesApplicationStrategy = resolveNodeForcesApplicationStrategy({
      distanceVectorGenerator: this.distanceVectorGenerator,
      nodeCharge: params.nodeCharge,
      maxForce: params.maxForce,
      nodeForceCoefficient: params.nodeForceCoefficient,
      theta: params.barnesHutTheta,
      areaRadiusThreshold: params.barnesHutAreaRadiusThreshold,
      nodeMass: params.nodeMass,
    });

    this.fillerLayoutAlgorithm = new RandomFillerLayoutAlgorithm({
      rand: params.rand,
      sparsity: params.edgeEquilibriumLength,
    });
  }

  public calculateNextCoordinates(
    params: AnimatedLayoutAlgorithmParams,
  ): ReadonlyMap<Identifier, Point> {
    const { graph, viewport, dt } = params;

    const currentCoords = this.fillerLayoutAlgorithm.calculateCoordinates({
      graph,
      viewport,
    });

    const iteration = new ForceDirectedAlgorithmIteration(
      graph,
      currentCoords,
      {
        distanceVectorGenerator: this.distanceVectorGenerator,
        nodeForcesApplicationStrategy: this.nodeForcesApplicationStrategy,
        dtSec: Math.min(dt, this.maxTimeDeltaSec),
        nodeMass: this.nodeMass,
        edgeEquilibriumLength: this.edgeEquilibriumLength,
        edgeStiffness: this.edgeStiffness,
      },
    );

    const maxVelocity = iteration.apply();

    if (maxVelocity < this.convergenceVelocity) {
      const hasUnsetCoords = graph.getAllNodeIds().some((nodeId) => {
        const node = graph.getNode(nodeId);

        return node.x === null || node.y === null;
      });

      if (!hasUnsetCoords) {
        return new Map();
      }
    }

    return currentCoords;
  }
}
