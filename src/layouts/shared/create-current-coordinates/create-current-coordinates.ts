import { Graph } from "@/graph";
import { Identifier } from "@/identifier";
import { Point } from "@/point";
import { MutablePoint } from "../physical-simulation-iteration";

export const createCurrentCoordinates = (
  graph: Graph,
  rand: () => number,
  edgeLength: number,
): ReadonlyMap<Identifier, MutablePoint> => {
  const currentCoords = new Map<Identifier, Point>();
  const nodeIds = graph.getAllNodeIds();

  const side = Math.sqrt(nodeIds.length);

  nodeIds.forEach((nodeId) => {
    const node = graph.getNode(nodeId)!;

    currentCoords.set(nodeId, {
      x: node.x ?? side * rand() * edgeLength,
      y: node.y ?? side * rand() * edgeLength,
    });
  });

  return currentCoords;
};
