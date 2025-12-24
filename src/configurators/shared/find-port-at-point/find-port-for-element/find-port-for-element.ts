import { Graph } from "@/graph";
import { Identifier } from "@/identifier";

export const findPortForElement = (
  graph: Graph,
  element: Element,
): Identifier | null => {
  let elementBuf: Element | null = element;
  let portId: Identifier | null = null;

  while (elementBuf !== null) {
    portId = graph.getElementPortIds(elementBuf as HTMLElement)[0] ?? null;

    if (portId !== null) {
      break;
    }

    elementBuf = elementBuf.parentElement;
  }

  return portId;
};
