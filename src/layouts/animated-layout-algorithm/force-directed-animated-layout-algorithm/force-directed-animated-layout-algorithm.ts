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
    const currentCoords = createCurrentCoordinates(
      graph,
      this.params.rand,
      this.params.edgeEquilibriumLength,
    );

    const iteration = new PhysicalSimulationIteration(graph, currentCoords, {
      rand: this.params.rand,
      dtSec: Math.min(dtSec, this.params.maxTimeDeltaSec),
      nodeMass: this.params.nodeMass,
      nodeCharge: this.params.nodeCharge,
      edgeEquilibriumLength: this.params.edgeEquilibriumLength,
      effectiveDistance: this.params.effectiveDistance,
      edgeStiffness: this.params.edgeStiffness,
    });

    const maxDelta = iteration.next();

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
