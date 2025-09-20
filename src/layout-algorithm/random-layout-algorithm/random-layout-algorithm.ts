import { Graph } from "@/graph";
import { Identifier } from "@/identifier";
import { Point } from "@/point";
import { LayoutAlgorithm } from "../layout-algorithm";

export class RandomLayoutAlgorithm implements LayoutAlgorithm {
  private readonly random: () => number;

  private readonly randomX: () => number;

  private readonly randomY: () => number;

  private readonly minX: number;

  private readonly maxX: number;

  private readonly minY: number;

  private readonly maxY: number;

  private readonly width: number;

  private readonly height: number;

  public constructor(
    private readonly params: {
      readonly minX: number;
      readonly maxX: number;
      readonly minY: number;
      readonly maxY: number;
      readonly random: () => number;
    },
  ) {
    this.random = this.params.random;
    this.minX = Math.min(this.params.minX, this.params.maxX);
    this.maxX = Math.max(this.params.minX, this.params.maxX);
    this.minY = Math.min(this.params.minY, this.params.maxY);
    this.maxY = Math.max(this.params.minY, this.params.maxY);
    this.width = this.maxX - this.minX;
    this.height = this.maxY - this.minY;
    this.randomX = (): number => this.random() * this.width + this.minX;
    this.randomY = (): number => this.random() * this.height + this.minY;
  }

  public calculateCoordinates(graph: Graph): ReadonlyMap<Identifier, Point> {
    const coords = new Map<Identifier, Point>();

    graph.getAllNodeIds().forEach((nodeId) => {
      const node = graph.getNode(nodeId)!;
      coords.set(nodeId, {
        x: node.x ?? this.randomX(),
        y: node.y ?? this.randomY(),
      });
    });

    return coords;
  }
}
