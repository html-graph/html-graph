import { Graph, Identifier } from "@html-graph/html-graph";
import { MutablePoint } from "./mutable-point";

interface NodeDistance {
  readonly ex: number;
  readonly ey: number;
  readonly d: number;
}

export class PhysicalSimulationIteration {
  private readonly perfectDistance = 500;

  private readonly mass = 1;

  private readonly k = 1_000_000;

  private readonly elasticity = 0.01;

  public constructor(
    private readonly graph: Graph,
    private readonly coords: Map<Identifier, MutablePoint>,
    private readonly velocities: Map<Identifier, MutablePoint>,
    private readonly dt: number,
  ) {}

  public next(): void {
    const forces = new Map<Identifier, MutablePoint>();

    this.coords.forEach((_coord, nodeId) => {
      forces.set(nodeId, { x: 0, y: 0 });
    });

    const nodeIds = this.graph.getAllNodeIds();

    let i = 0,
      j;

    const distances = new Map<Identifier, Map<Identifier, NodeDistance>>();

    for (; i < nodeIds.length; i++) {
      const nodeIdFrom = nodeIds[i];
      const coordsFrom = this.coords.get(nodeIdFrom)!;
      const nodeFromDistances = new Map<Identifier, NodeDistance>();

      for (j = i + 1; j < nodeIds.length; j++) {
        const nodeIdTo = nodeIds[j];
        const coordsTo = this.coords.get(nodeIdTo)!;
        const dx = coordsTo.x - coordsFrom.x;
        const dy = coordsTo.y - coordsFrom.y;
        const d2 = dx * dx + dy * dy;
        const d = Math.sqrt(d2);
        const ex = dx / d;
        const ey = dy / d;

        nodeFromDistances.set(nodeIdTo, { ex, ey, d });

        const forceFrom = forces.get(nodeIdFrom)!;
        const forceTo = forces.get(nodeIdTo)!;
        const totalForce = this.k / d2;
        const fx = (totalForce * ex) / 2;
        const fy = (totalForce * ey) / 2;

        forceFrom.x -= fx;
        forceFrom.y -= fy;
        forceTo.x += fx;
        forceTo.y += fy;
      }

      distances.set(nodeIdFrom, nodeFromDistances);
    }

    this.graph.getAllEdgeIds().forEach((edgeId) => {
      const edge = this.graph.getEdge(edgeId)!;
      const portFrom = this.graph.getPort(edge.from)!;
      const portTo = this.graph.getPort(edge.to)!;

      const dist =
        distances.has(portFrom.nodeId) &&
        distances.get(portFrom.nodeId)!.has(portTo.nodeId)
          ? distances.get(portFrom.nodeId)!.get(portTo.nodeId)!
          : distances.get(portTo.nodeId)!.get(portFrom.nodeId)!;

      const offset = dist.d - this.perfectDistance;

      const fx = ((dist.ex * offset) / 2) * this.elasticity;
      const fy = ((dist.ey * offset) / 2) * this.elasticity;

      const forceFrom = forces.get(portFrom.nodeId)!;
      forceFrom.x += fx;
      forceFrom.y += fy;

      const forceTo = forces.get(portTo.nodeId)!;
      forceTo.x -= fx;
      forceTo.y -= fy;
    });

    forces.forEach((force, nodeId) => {
      const velocity = this.velocities.get(nodeId)!;

      velocity.x += (force.x / this.mass) * this.dt;
      velocity.y += (force.y / this.mass) * this.dt;
    });

    this.coords.forEach((coord, nodeId) => {
      const velocity = this.velocities.get(nodeId)!;

      coord.x += velocity.x * this.dt;
      coord.y += velocity.y * this.dt;
    });
  }
}
