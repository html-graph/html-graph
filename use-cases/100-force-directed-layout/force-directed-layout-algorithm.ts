import {
  Graph,
  Identifier,
  LayoutAlgorithm,
  Point,
} from "@html-graph/html-graph";

interface Vector {
  readonly distance: number;
  readonly ex: number;
  readonly ey: number;
}

export class ForceDirectedLayoutAlgorithm implements LayoutAlgorithm {
  public constructor(
    private readonly params: {
      readonly boundingWidth: number;
      readonly boundingHeight: number;
      readonly iterations: number;
      readonly perfectDistance: number;
    },
  ) {}

  public calculateCoordinates(graph: Graph): ReadonlyMap<Identifier, Point> {
    const seed = this.cyrb128("chstytwwbbnhgj1d");
    const rand = this.sfc32(seed[0], seed[1], seed[2], seed[3]);
    const coords = new Map<Identifier, { x: number; y: number }>();
    const outgoingSet = new Map<Identifier, Set<Identifier>>();

    graph.getAllNodeIds().forEach((nodeId) => {
      coords.set(nodeId, {
        x: rand() * this.params.boundingWidth,
        y: rand() * this.params.boundingHeight,
      });

      const outgoing = new Set(
        graph
          .getNodeOutgoingEdgeIds(nodeId)!
          .map((edgeId) => graph.getPort(graph.getEdge(edgeId)!.to)!.nodeId),
      );

      outgoingSet.set(nodeId, outgoing);
    });

    for (let i = 0; i < this.params.iterations; i++) {
      this.iterate(coords, outgoingSet);
    }

    return coords;
  }

  private addEdge(
    from: Identifier,
    to: Identifier,
    distance: Vector,
    adjacentDistances: Map<Identifier, Map<Identifier, Vector>>,
  ): void {
    const ids = adjacentDistances.get(from);

    if (ids !== undefined) {
      ids.set(to, distance);
    } else {
      adjacentDistances.set(from, new Map([[to, distance]]));
    }
  }

  private iterate(
    coords: Map<Identifier, { x: number; y: number }>,
    outgoingSet: Map<Identifier, Set<Identifier>>,
  ): void {
    const adjacentVectors = new Map<Identifier, Map<Identifier, Vector>>();

    outgoingSet.forEach((outgoing, fromId) => {
      outgoing.forEach((toId) => {
        const from = coords.get(fromId)!;
        const to = coords.get(toId)!;

        const dx = to.x! - from.x!;
        const dy = to.y! - from.y!;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const ex = dx / distance;
        const ey = dy / distance;

        this.addEdge(fromId, toId, { distance, ex, ey }, adjacentVectors);
        this.addEdge(
          toId,
          fromId,
          { distance, ex: -ex, ey: -ey },
          adjacentVectors,
        );
      });
    });

    coords.forEach((point, nodeId) => {
      const vectors = adjacentVectors.get(nodeId);

      if (vectors === undefined) {
        return;
      }

      let dx = 0;
      let dy = 0;

      vectors.forEach((vector) => {
        const dd = vector.distance - this.params.perfectDistance;
        console.log(dd);

        dx += vector.ex * dd;
        dy += vector.ey * dd;
      });

      coords.set(nodeId, { x: point.x + dx, y: point.y + dy });
    });
  }

  private sfc32(a: number, b: number, c: number, d: number) {
    return function (): number {
      a |= 0;
      b |= 0;
      c |= 0;
      d |= 0;

      const t = (((a + b) | 0) + d) | 0;

      d = (d + 1) | 0;
      a = b ^ (b >>> 9);
      b = (c + (c << 3)) | 0;
      c = (c << 21) | (c >>> 11);
      c = (c + t) | 0;

      return (t >>> 0) / 4294967296;
    };
  }

  private cyrb128(str: string): [number, number, number, number] {
    let h1 = 1779033703,
      h2 = 3144134277,
      h3 = 1013904242,
      h4 = 2773480762;

    for (let i = 0, k; i < str.length; i++) {
      k = str.charCodeAt(i);
      h1 = h2 ^ Math.imul(h1 ^ k, 597399067);
      h2 = h3 ^ Math.imul(h2 ^ k, 2869860233);
      h3 = h4 ^ Math.imul(h3 ^ k, 951274213);
      h4 = h1 ^ Math.imul(h4 ^ k, 2716044179);
    }

    h1 = Math.imul(h3 ^ (h1 >>> 18), 597399067);
    h2 = Math.imul(h4 ^ (h2 >>> 22), 2869860233);
    h3 = Math.imul(h1 ^ (h3 >>> 17), 951274213);
    h4 = Math.imul(h2 ^ (h4 >>> 19), 2716044179);

    h1 ^= h2 ^ h3 ^ h4;
    h2 ^= h1;
    h3 ^= h1;
    h4 ^= h1;

    return [h1 >>> 0, h2 >>> 0, h3 >>> 0, h4 >>> 0];
  }
}
