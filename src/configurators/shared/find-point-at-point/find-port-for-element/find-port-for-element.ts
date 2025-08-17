import { Graph } from "@/graph";
import { Identifier } from "@/identifier";

export const findPortForElement = (
  graph: Graph,
  element: Element,
): Identifier | null => {
  let elementBuf: Element | null = element;
  let draggingPortId: Identifier | null = null;

  while (elementBuf !== null) {
    draggingPortId =
      graph.getElementPortIds(elementBuf as HTMLElement)[0] ?? null;

    if (draggingPortId !== null) {
      break;
    }

    elementBuf = elementBuf.parentElement;
  }

  return draggingPortId;
};
