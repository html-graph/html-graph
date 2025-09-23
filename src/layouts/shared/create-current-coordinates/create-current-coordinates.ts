import { Graph } from "@/graph";
import { Identifier } from "@/identifier";
import { Point } from "@/point";
import { MutablePoint } from "../physical-simulation-iteration";

export const createCurrentCoordinates = (
  graph: Graph,
  xFallbackResolver: (nodeId: Identifier) => number,
  yFallbackResolver: (nodeId: Identifier) => number,
): ReadonlyMap<Identifier, MutablePoint> => {
  const currentCoords = new Map<Identifier, Point>();
  const nodeIds = graph.getAllNodeIds();

  nodeIds.forEach((nodeId) => {
    const node = graph.getNode(nodeId)!;

    currentCoords.set(nodeId, {
      x: node.x ?? xFallbackResolver(nodeId),
      y: node.y ?? yFallbackResolver(nodeId),
    });
  });

  return currentCoords;
};
