import { Graph } from "@/graph";
import { PortSearchResult } from "./port-search-result";
import { PortIdResolver } from "../../port-id-resolver";

export const findPortForElement = (
  graph: Graph,
  element: Element,
  portIdResolver: PortIdResolver,
): PortSearchResult => {
  let elementBuf: Element | null = element;

  while (elementBuf !== null) {
    const portIds = graph.findPortIdsByElement(elementBuf);
    const portId = portIdResolver(portIds);

    if (portId !== null) {
      return {
        status: "portFound",
        portId,
      };
    }

    const nodeId = graph.findNodeIdByElement(elementBuf);

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
