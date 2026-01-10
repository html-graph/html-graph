import { Identifier } from "@/identifier";
import { Point } from "@/point";
import { AnimatedLayoutAlgorithm } from "../animated-layout-algorithm";
import { Graph } from "@/graph";
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

export class ForceDirectedAnimatedLayoutAlgorithm
  implements AnimatedLayoutAlgorithm
{
  private readonly distanceVectorGenerator: DistanceVectorGenerator;

  private readonly nodeForcesApplicationStrategy: NodeForcesApplicationStrategy;

  private readonly convergenceDelta: number;

  private readonly convergenceVelocity: number;

  private readonly maxTimeDeltaSec: number;

  private readonly nodeMass: number;

  private readonly edgeEquilibriumLength: number;

  private readonly edgeStiffness: number;

  private readonly fillerLayout: LayoutAlgorithm;

  public constructor(params: ForceDirectedAnimatedLayoutAlgorithmParams) {
    this.convergenceDelta = params.convergenceDelta;
    this.convergenceVelocity = params.convergenceVelocity;
    this.maxTimeDeltaSec = params.maxTimeDeltaSec;
    this.nodeMass = params.nodeMass;
    this.edgeEquilibriumLength = params.edgeEquilibriumLength;
    this.edgeStiffness = params.edgeStiffness;

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
      density: params.edgeEquilibriumLength,
    });
  }

  public calculateNextCoordinates(
    graph: Graph,
    dtSec: number,
  ): ReadonlyMap<Identifier, Point> {
    const currentCoords = this.fillerLayout.calculateCoordinates(graph);

    const iteration = new ForceDirectedAlgorithmIteration(
      graph,
      currentCoords,
      {
        distanceVectorGenerator: this.distanceVectorGenerator,
        nodeForcesApplicationStrategy: this.nodeForcesApplicationStrategy,
        dtSec: Math.min(dtSec, this.maxTimeDeltaSec),
        nodeMass: this.nodeMass,
        edgeEquilibriumLength: this.edgeEquilibriumLength,
        edgeStiffness: this.edgeStiffness,
      },
    );

    const [maxDelta, maxVelocity] = iteration.apply();

    if (
      maxDelta < this.convergenceDelta ||
      maxVelocity < this.convergenceVelocity
    ) {
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
