import { Graph } from "@/graph";
import { PortSearchResult } from "./port-search-result";

export const findPortForElement = (
  graph: Graph,
  element: Element,
): PortSearchResult => {
  let elementBuf: Element | null = element;

  while (elementBuf !== null) {
    const portId =
      graph.getElementPortIds(elementBuf as HTMLElement)[0] ?? null;

    if (portId !== null) {
      return {
        status: "portFound",
        portId,
      };
    }

    elementBuf = elementBuf.parentElement;
  }

  return {
    status: "notFound",
  };
};
