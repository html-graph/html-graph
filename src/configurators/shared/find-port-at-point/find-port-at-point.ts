import { Point } from "@/point";
import { findPortForElement } from "./find-port-for-element";
import { Identifier } from "@/identifier";
import { Graph } from "@/graph";
import { getElementsAtPoint } from "./get-elements-at-point";
import { PortIdResolver } from "../port-id-resolver";

export const findPortAtPoint = (
  graph: Graph,
  point: Point,
  portIdResolver: PortIdResolver,
): Identifier | null => {
  const elements = getElementsAtPoint(document, point);

  for (const element of elements) {
    const result = findPortForElement(graph, element, portIdResolver);

    if (result.status === "portFound") {
      return result.portId;
    }

    if (result.status === "nodeEncountered") {
      return null;
    }
  }

  return null;
};
