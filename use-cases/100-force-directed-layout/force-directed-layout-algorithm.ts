import {
  Graph,
  Identifier,
  LayoutAlgorithm,
  Point,
} from "@html-graph/html-graph";
import { MutablePoint } from "./mutable-point";
import { PhysicalSimulationIteration } from "./physical-simulation-iteration";

export class ForceDirectedLayoutAlgorithm implements LayoutAlgorithm {
  public constructor(
    private readonly params: {
      readonly boundingWidth: number;
      readonly boundingHeight: number;
      readonly iterations: number;
      readonly equilibriumEdgeLength: number;
    },
  ) {}

  public calculateCoordinates(graph: Graph): ReadonlyMap<Identifier, Point> {
    const seed = this.cyrb128("chstytwwbbnhgj1d");
    const rand = this.sfc32(seed[0], seed[1], seed[2], seed[3]);

    const coords = new Map<Identifier, MutablePoint>();

    graph.getAllNodeIds().forEach((nodeId) => {
      coords.set(nodeId, {
        x: rand() * this.params.boundingWidth,
        y: rand() * this.params.boundingHeight,
      });
    });

    for (let i = 0; i < this.params.iterations; i++) {
      const iteration = new PhysicalSimulationIteration(
        graph,
        coords,
        1,
        this.params.equilibriumEdgeLength,
      );
      iteration.next();
    }

    return coords;
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
