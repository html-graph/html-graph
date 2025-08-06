import { Point } from "@/point";
import { findPortForElement } from "./find-port-for-element";
import { Graph } from "@/graph";

export const findPortAtPoint = (
  graph: Graph<number>,
  point: Point,
): unknown | null => {
  const elements = document.elementsFromPoint(point.x, point.y);

  for (const element of elements) {
    const draggingPortId = findPortForElement(graph, element);

    if (draggingPortId !== null) {
      return draggingPortId;
    }
  }

  return null;
};
