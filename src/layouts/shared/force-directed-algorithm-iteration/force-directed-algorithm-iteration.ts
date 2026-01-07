import { Graph } from "@/graph";
import { Identifier } from "@/identifier";
import { Point } from "@/point";
import { ForceDirectedAlgorithmIterationParams } from "./force-directed-algorithm-iteration-params";
import { MutablePoint } from "@/point";
import { DistanceVectorGenerator } from "../distance-vector-generator";
import { NodeForcesApplicationStrategy } from "../node-forces-application-strategy";

export class ForceDirectedAlgorithmIteration {
  private readonly dt: number;

  private readonly nodeMass: number;

  private readonly edgeEquilibriumLength: number;

  private readonly edgeStiffness: number;

  private readonly nodeForcesApplicationStrategy: NodeForcesApplicationStrategy;

  private readonly distance: DistanceVectorGenerator;

  public constructor(
    private readonly graph: Graph,
    private readonly currentCoords: ReadonlyMap<Identifier, MutablePoint>,
    params: ForceDirectedAlgorithmIterationParams,
  ) {
    this.dt = params.dtSec;
    this.nodeMass = params.nodeMass;
    this.edgeEquilibriumLength = params.edgeEquilibriumLength;
    this.edgeStiffness = params.edgeStiffness;
    this.distance = params.distance;
    this.nodeForcesApplicationStrategy = params.nodeForcesApplicationStrategy;
  }

  public apply(): number {
    let maxDelta = 0;
    const forces = new Map<Identifier, MutablePoint>();

    const nodeIds = this.graph.getAllNodeIds();

    nodeIds.forEach((nodeId) => {
      forces.set(nodeId, { x: 0, y: 0 });
    });

    this.nodeForcesApplicationStrategy.apply(this.currentCoords, forces);

    this.applyEdgeForces(forces);

    this.currentCoords.forEach((coords, nodeId) => {
      const force = forces.get(nodeId)!;

      const velocity: Point = {
        x: (force.x / this.nodeMass) * this.dt,
        y: (force.y / this.nodeMass) * this.dt,
      };

      const dx = velocity.x * this.dt;
      const dy = velocity.y * this.dt;

      coords.x += dx;
      coords.y += dy;
      maxDelta = Math.max(maxDelta, Math.sqrt(dx * dx + dy * dy));
    });

    return maxDelta;
  }

  private applyEdgeForces(forces: ReadonlyMap<Identifier, MutablePoint>): void {
    this.graph.getAllEdgeIds().forEach((edgeId) => {
      const edge = this.graph.getEdge(edgeId)!;
      const portFrom = this.graph.getPort(edge.from)!;
      const portTo = this.graph.getPort(edge.to)!;
      const sourceCoords = this.currentCoords.get(portFrom.nodeId)!;
      const targetCoords = this.currentCoords.get(portTo.nodeId)!;
      const vector = this.distance.create(sourceCoords, targetCoords);
      const delta = vector.d - this.edgeEquilibriumLength;
      // division by 2 is incorrect
      const f2 = (delta * this.edgeStiffness) / 2;
      const f2x = vector.ex * f2;
      const f2y = vector.ey * f2;

      const forceFrom = forces.get(portFrom.nodeId)!;
      const forceTo = forces.get(portTo.nodeId)!;

      forceFrom.x += f2x;
      forceFrom.y += f2y;
      forceTo.x -= f2x;
      forceTo.y -= f2y;
    });
  }
}
