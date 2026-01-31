import { Identifier } from "@/identifier";
import { LayoutAlgorithm } from "../layout-algorithm";
import type { Point } from "@/point";
import { RandomFillerLayoutAlgorithmParams } from "./random-filler-layout-algorithm-params";
import { LayoutAlgorithmParams } from "../layout-algorithm-params";

export class RandomFillerLayoutAlgorithm implements LayoutAlgorithm {
  private readonly rand: () => number;

  private readonly sparsity: number;

  public constructor(params: RandomFillerLayoutAlgorithmParams) {
    this.rand = params.rand;
    this.sparsity = params.sparsity;
  }

  public calculateCoordinates(
    params: LayoutAlgorithmParams,
  ): ReadonlyMap<Identifier, Point> {
    const { graph, viewport } = params;
    const currentCoords = new Map<Identifier, Point>();
    const unsetNodeIds = graph.getAllNodeIds().filter((nodeId) => {
      const node = graph.getNode(nodeId);

      return node.x === null || node.y === null;
    });

    const side = Math.sqrt(unsetNodeIds.length) * this.sparsity;
    const { width, height } = viewport.getDimensions();
    const centerViewport: Point = { x: width / 2, y: height / 2 };
    const centerContent: Point = viewport.createContentCoords(centerViewport);
    const halfSide = side / 2;
    const areaBottomLeft: Point = {
      x: centerContent.x - halfSide,
      y: centerContent.y - halfSide,
    };

    const nodeIds = graph.getAllNodeIds();

    nodeIds.forEach((nodeId) => {
      const node = graph.getNode(nodeId);

      currentCoords.set(nodeId, {
        x: node.x ?? areaBottomLeft.x + side * this.rand(),
        y: node.y ?? areaBottomLeft.y + side * this.rand(),
      });
    });

    return currentCoords;
  }
}
