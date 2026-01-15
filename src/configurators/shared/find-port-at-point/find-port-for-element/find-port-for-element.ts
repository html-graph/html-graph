import { Graph } from "@/graph";
import { PortSearchResult } from "./port-search-result";

export const findPortForElement = (
  graph: Graph,
  element: Element,
): PortSearchResult => {
  let elementBuf: Element | null = element;

  while (elementBuf !== null) {
    const portId =
      graph.findPortIdsByElement(elementBuf as HTMLElement)[0] ?? null;

    if (portId !== null) {
      return {
        status: "portFound",
        portId,
      };
    }

    const nodeId = graph.findNodeIdByElement(elementBuf as HTMLElement);

    if (nodeId !== undefined) {
      return {
        status: "nodeEncountered",
      };
    }

    elementBuf = elementBuf.parentElement;
  }

  return {
    status: "notFound",
  };
};
