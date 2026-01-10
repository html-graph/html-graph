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

  private readonly distanceVectorGenerator: DistanceVectorGenerator;

  public constructor(
    private readonly graph: Graph,
    private readonly currentCoords: ReadonlyMap<Identifier, MutablePoint>,
    params: ForceDirectedAlgorithmIterationParams,
  ) {
    this.dt = params.dtSec;
    this.nodeMass = params.nodeMass;
    this.edgeEquilibriumLength = params.edgeEquilibriumLength;
    this.edgeStiffness = params.edgeStiffness;
    this.distanceVectorGenerator = params.distanceVectorGenerator;
    this.nodeForcesApplicationStrategy = params.nodeForcesApplicationStrategy;
  }

  public apply(): [number, number] {
    let maxDelta = 0;
    let maxVelocity = 0;
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

      maxVelocity = Math.max(
        maxVelocity,
        Math.sqrt(velocity.x * velocity.x + velocity.y * velocity.y),
      );

      const dx = velocity.x * this.dt;
      const dy = velocity.y * this.dt;

      coords.x += dx;
      coords.y += dy;
      maxDelta = Math.max(maxDelta, Math.sqrt(dx * dx + dy * dy));
    });

    return [maxDelta, maxVelocity];
  }

  private applyEdgeForces(forces: ReadonlyMap<Identifier, MutablePoint>): void {
    this.graph.getAllEdgeIds().forEach((edgeId) => {
      const edge = this.graph.getEdge(edgeId)!;
      const portFrom = this.graph.getPort(edge.from)!;
      const portTo = this.graph.getPort(edge.to)!;
      const sourceCoords = this.currentCoords.get(portFrom.nodeId)!;
      const targetCoords = this.currentCoords.get(portTo.nodeId)!;
      const vector = this.distanceVectorGenerator.create(
        sourceCoords,
        targetCoords,
      );
      const delta = vector.d - this.edgeEquilibriumLength;
      const f = delta * this.edgeStiffness;
      const fx = vector.ex * f;
      const fy = vector.ey * f;

      const forceFrom = forces.get(portFrom.nodeId)!;
      const forceTo = forces.get(portTo.nodeId)!;

      forceFrom.x += fx;
      forceFrom.y += fy;
      forceTo.x -= fx;
      forceTo.y -= fy;
    });
  }
}
