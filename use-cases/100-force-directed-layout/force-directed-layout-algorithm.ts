import {
  AnimatedLayoutAlgorithm,
  Graph,
  Identifier,
  Point,
} from "@html-graph/html-graph";
import { PhysicalSimulationIteration } from "./physical-simulation-iteration";

export class ForceDirectedLayoutAlgorithm implements AnimatedLayoutAlgorithm {
  public constructor(
    private readonly params: {
      readonly equilibriumEdgeLength: number;
      readonly nodeCharge: number;
      readonly nodeMass: number;
      readonly edgeStiffness: number;
      readonly xFallbackResolver: (nodeId: Identifier) => number;
      readonly yFallbackResolver: (nodeId: Identifier) => number;
    },
  ) {}

  public calculateNextCoordinates(
    graph: Graph,
    dt: number,
    staticNodes: ReadonlySet<Identifier>,
  ): ReadonlyMap<Identifier, Point> {
    const iteration = new PhysicalSimulationIteration({
      graph,
      dt,
      equilibriumEdgeLength: this.params.equilibriumEdgeLength,
      nodeCharge: this.params.nodeCharge,
      nodeMass: this.params.nodeMass,
      edgeStiffness: this.params.edgeStiffness,
      staticNodes: staticNodes,
      xFallbackResolver: this.params.xFallbackResolver,
      yFallbackResolver: this.params.yFallbackResolver,
    });

    return iteration.calculateNextCoordinates();
  }
}
