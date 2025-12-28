import { Graph } from "@/graph";
import { Identifier } from "@/identifier";
import { Point } from "@/point";
import { MutablePoint } from "../mutable-point";

export const createCurrentCoordinates = (
  graph: Graph,
  rand: () => number,
  preferredEdgeLength: number,
): ReadonlyMap<Identifier, MutablePoint> => {
  const currentCoords = new Map<Identifier, Point>();
  const nodeIds = graph.getAllNodeIds();

  const side = Math.sqrt(nodeIds.length) * preferredEdgeLength;

  nodeIds.forEach((nodeId) => {
    const node = graph.getNode(nodeId)!;

    currentCoords.set(nodeId, {
      x: node.x ?? side * rand(),
      y: node.y ?? side * rand(),
    });
  });

  return currentCoords;
};
