import { Graph, Identifier, Point } from "@html-graph/html-graph";
import { MutablePoint } from "./mutable-point";
import { Vector } from "./vector";

export class PhysicalSimulationIteration {
  private readonly mass = 1;

  private readonly k: number;

  private readonly graph: Graph;

  private readonly equilibriumEdgeLength: number;

  private readonly edgeStiffness: number;

  private readonly staticNodeIds: ReadonlySet<Identifier>;

  private readonly dt: number;

  public constructor(
    private readonly params: {
      readonly graph: Graph;
      readonly dt: number;
      readonly equilibriumEdgeLength: number;
      readonly nodeCharge: number;
      readonly edgeStiffness: number;
      readonly staticNodeIds: ReadonlySet<Identifier>;
    },
  ) {
    const nodeCharge = this.params.nodeCharge;

    this.k = nodeCharge * nodeCharge;
    this.graph = this.params.graph;
    this.equilibriumEdgeLength = this.params.equilibriumEdgeLength;
    this.edgeStiffness = this.params.edgeStiffness;
    this.staticNodeIds = this.params.staticNodeIds;
    this.dt = this.params.dt;
  }

  public calculateNextCoordinates(): ReadonlyMap<Identifier, Point> {
    const coords = new Map<Identifier, Point>();
    const forces = new Map<Identifier, MutablePoint>();

    this.graph.getAllNodeIds().forEach((nodeId) => {
      forces.set(nodeId, { x: 0, y: 0 });
    });

    const nodeIds = this.graph.getAllNodeIds();

    let i = 0,
      j;

    const distances = new Map<Identifier, Map<Identifier, Vector>>();

    for (; i < nodeIds.length; i++) {
      const nodeIdFrom = nodeIds[i];
      const coordsFrom = this.graph.getNode(nodeIdFrom)!;
      const nodeFromDistances = new Map<Identifier, Vector>();

      for (j = i + 1; j < nodeIds.length; j++) {
        const nodeIdTo = nodeIds[j];
        const coordsTo = this.graph.getNode(nodeIdTo)!;
        const dx = coordsTo.x! - coordsFrom.x!;
        const dy = coordsTo.y! - coordsFrom.y!;
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

      const has =
        distances.has(portFrom.nodeId) &&
        distances.get(portFrom.nodeId)!.has(portTo.nodeId);

      const dist = has
        ? distances.get(portFrom.nodeId)!.get(portTo.nodeId)!
        : distances.get(portTo.nodeId)!.get(portFrom.nodeId)!;

      const offset = dist.d - this.equilibriumEdgeLength;

      const fx =
        (((has ? dist.ex : -dist.ex) * offset) / 2) * this.edgeStiffness;
      const fy =
        (((has ? dist.ey : -dist.ey) * offset) / 2) * this.edgeStiffness;

      const forceFrom = forces.get(portFrom.nodeId)!;
      forceFrom.x += fx;
      forceFrom.y += fy;

      const forceTo = forces.get(portTo.nodeId)!;
      forceTo.x -= fx;
      forceTo.y -= fy;
    });

    this.graph.getAllNodeIds().forEach((nodeId) => {
      if (this.staticNodeIds.has(nodeId)) {
        return;
      }

      const force = forces.get(nodeId)!;

      const velocity: Point = {
        x: (force.x / this.mass) * this.dt,
        y: (force.y / this.mass) * this.dt,
      };

      const node = this.graph.getNode(nodeId)!;
      const newCoords: Point = {
        x: node.x! + velocity.x * this.dt,
        y: node.y! + velocity.y * this.dt,
      };

      coords.set(nodeId, newCoords);
    });

    return coords;
  }
}
