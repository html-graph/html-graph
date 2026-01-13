import { Graph } from "@/graph";
import { Identifier } from "@/identifier";
import { LayoutAlgorithm } from "../layout-algorithm";
import type { Point } from "@/point";
import { RandomFillerLayoutAlgorithmParams } from "./random-filler-layout-algorithm-params";
import { Viewport } from "@/viewport";

export class RandomFillerLayoutAlgorithm implements LayoutAlgorithm {
  private readonly rand: () => number;

  private readonly sparsity: number;

  public constructor(params: RandomFillerLayoutAlgorithmParams) {
    this.rand = params.rand;
    this.sparsity = params.sparsity;
  }

  public calculateCoordinates(
    graph: Graph,
    viewport: Viewport,
  ): ReadonlyMap<Identifier, Point> {
    const currentCoords = new Map<Identifier, Point>();
    const nodeIds = graph.getAllNodeIds();

    const side = Math.sqrt(nodeIds.length) * this.sparsity;
    const { width, height } = viewport.getDimensions();
    const centerViewport: Point = { x: width / 2, y: height / 2 };
    const centerContent: Point = viewport.createContentCoords(centerViewport);
    const halfSide = side / 2;
    const areaBottomLeft: Point = {
      x: centerContent.x - halfSide,
      y: centerContent.y - halfSide,
    };

    nodeIds.forEach((nodeId) => {
      const node = graph.getNode(nodeId)!;

      currentCoords.set(nodeId, {
        x: node.x ?? areaBottomLeft.x + side * this.rand(),
        y: node.y ?? areaBottomLeft.y + side * this.rand(),
      });
    });

    return currentCoords;
  }
}
