import { Point } from "@/point";
import { findPortForElement } from "./find-port-for-element";
import { GenericGraph } from "@/generic-graph";

export const findPortAtPoint = (
  graph: GenericGraph<number>,
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
