import {
  Graph,
  GraphNode,
  Identifier,
  LayoutAlgorithm,
  Point,
} from "@html-graph/html-graph";
import { MutablePoint } from "./mutable-point";
import { PhysicalSimulationIteration } from "./physical-simulation-iteration";

export class ForceDirectedLayoutAlgorithm implements LayoutAlgorithm {
  private dt = 0.1;

  private readonly staticNodeIds = new Set<Identifier>();

  public constructor(
    private readonly params: {
      readonly iterations: number;
      readonly equilibriumEdgeLength: number;
      readonly nodeCharge: number;
      readonly edgeStiffness: number;
      readonly timeDelta: number;
      readonly initialCoordinatesResolver: (
        node: GraphNode,
        nodeId: Identifier,
      ) => Point;
    },
  ) {
    this.dt = this.params.timeDelta;
  }

  public calculateCoordinates(graph: Graph): ReadonlyMap<Identifier, Point> {
    const coords = new Map<Identifier, MutablePoint>();

    graph.getAllNodeIds().forEach((nodeId) => {
      const node = graph.getNode(nodeId)!;

      coords.set(nodeId, this.params.initialCoordinatesResolver(node, nodeId));
    });

    const iteration = new PhysicalSimulationIteration(
      graph,
      coords,
      this.dt,
      this.params.equilibriumEdgeLength,
      this.params.nodeCharge,
      this.params.edgeStiffness,
      this.staticNodeIds,
    );

    for (let i = 0; i < this.params.iterations; i++) {
      iteration.updateNodeCoords();
    }

    return coords;
  }

  public setTimeDelta(dt: number): void {
    this.dt = dt;
  }

  public setStaticNode(nodeId: Identifier): void {
    this.staticNodeIds.add(nodeId);
  }

  public unsetStaticNode(nodeId: Identifier): void {
    this.staticNodeIds.delete(nodeId);
  }
}
