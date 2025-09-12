import { Graph, Identifier } from "@html-graph/html-graph";
import { MutablePoint } from "./mutable-point";

export class PhysicalSimulationIteration {
  private readonly perfectDistance = 500;

  private readonly elasticity = 1;

  public constructor(
    private readonly graph: Graph,
    private readonly coords: Map<Identifier, MutablePoint>,
    private readonly velociies: Map<Identifier, MutablePoint>,
    private readonly dt: number,
  ) {}

  public next(): void {
    const forces = new Map<Identifier, MutablePoint>();

    this.coords.forEach((_coord, nodeId) => {
      forces.set(nodeId, { x: 0, y: 0 });
    });

    this.graph.getAllEdgeIds().forEach((edgeId) => {
      const edge = this.graph.getEdge(edgeId)!;
      const portFrom = this.graph.getPort(edge.from)!;
      const portTo = this.graph.getPort(edge.to)!;
      const coordsFrom = this.coords.get(portFrom.nodeId)!;
      const coordsTo = this.coords.get(portTo.nodeId)!;

      const dx = coordsTo.x - coordsFrom.x;
      const dy = coordsTo.y - coordsFrom.y;
      const d = Math.sqrt(dx * dx + dy * dy);
      const offset = d - this.perfectDistance;

      const fx = ((dx / d) * offset) / 2;
      const fy = ((dy / d) * offset) / 2;

      const forceFrom = forces.get(portFrom.nodeId)!;
      forceFrom.x += fx;
      forceFrom.y += fy;

      const forceTo = forces.get(portTo.nodeId)!;
      forceTo.x -= fx;
      forceTo.y -= fy;
    });

    forces.forEach((force, nodeId) => {
      const velocity = this.velociies.get(nodeId)!;
      velocity.x += (force.x / this.elasticity) * this.dt;
      velocity.y += (force.y / this.elasticity) * this.dt;
    });

    this.coords.forEach((coord, nodeId) => {
      const velocity = this.velociies.get(nodeId)!;

      coord.x += velocity.x * this.dt;
      coord.y += velocity.y * this.dt;
    });

    const nodeIds = this.graph.getAllNodeIds();

    let i = 0,
      j = 0;

    for (; i < nodeIds.length; i++) {
      for (j = i; j < nodeIds.length; j++) {
        //
      }
    }
  }
}
