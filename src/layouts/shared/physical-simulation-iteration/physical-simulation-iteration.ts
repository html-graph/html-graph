import { Graph } from "@/graph";
import { Identifier } from "@/identifier";
import { Point } from "@/point";
import { PhysicalSimulationParams } from "./physical-sumulation-params";
import { MutablePoint } from "./mutable-point";
import { NodeDistanceVectors } from "./node-distance-vectors";

export class PhysicalSimulationIteration {
  private readonly dtSec: number;

  private readonly k: number;

  private readonly nodeMass: number;

  private readonly edgeEquilibriumLength: number;

  private readonly edgeStiffness: number;

  private readonly effectiveDistance: number;

  public constructor(
    private readonly graph: Graph,
    private readonly currentCoords: ReadonlyMap<Identifier, MutablePoint>,
    private readonly params: PhysicalSimulationParams,
  ) {
    this.dtSec = this.params.dtSec;
    this.k = this.params.nodeCharge * this.params.nodeCharge;
    this.nodeMass = this.params.nodeMass;
    this.edgeEquilibriumLength = this.params.edgeEquilibriumLength;
    this.edgeStiffness = this.params.edgeStiffness;
    this.effectiveDistance = this.params.effectiveDistance;
  }

  public next(): number {
    let maxDelta = 0;
    const forces = new Map<Identifier, MutablePoint>();

    const nodeIds = this.graph.getAllNodeIds();

    nodeIds.forEach((nodeId) => {
      forces.set(nodeId, { x: 0, y: 0 });
    });

    const vectors = new NodeDistanceVectors(
      this.currentCoords,
      this.params.rand,
    );

    const size = nodeIds.length;

    for (let i = 0; i < size; i++) {
      const nodeIdFrom = nodeIds[i];

      for (let j = i + 1; j < size; j++) {
        const nodeIdTo = nodeIds[j];

        const vector = vectors.getVector(nodeIdFrom, nodeIdTo);

        if (vector.d > this.effectiveDistance) {
          continue;
        }

        const f = this.k / vector.d2;

        const fx = f * vector.ex;
        const fy = f * vector.ey;
        const f2x = fx / 2;
        const f2y = fy / 2;

        const forceFrom = forces.get(nodeIdFrom)!;
        const forceTo = forces.get(nodeIdTo)!;

        forceFrom.x -= f2x;
        forceFrom.y -= f2y;
        forceTo.x += f2x;
        forceTo.y += f2y;
      }
    }

    this.graph.getAllEdgeIds().forEach((edgeId) => {
      const edge = this.graph.getEdge(edgeId)!;
      const portFrom = this.graph.getPort(edge.from)!;
      const portTo = this.graph.getPort(edge.to)!;
      const vector = vectors.getVector(portFrom.nodeId, portTo.nodeId);
      const delta = vector.d - this.edgeEquilibriumLength;
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

    this.currentCoords.forEach((coords, nodeId) => {
      const force = forces.get(nodeId)!;

      const velocity: Point = {
        x: (force.x / this.nodeMass) * this.dtSec,
        y: (force.y / this.nodeMass) * this.dtSec,
      };

      const dx = velocity.x * this.dtSec;
      const dy = velocity.y * this.dtSec;

      coords.x += dx;
      coords.y += dy;
      maxDelta = Math.max(maxDelta, Math.sqrt(dx * dx + dy * dy));
    });

    return maxDelta;
  }
}
