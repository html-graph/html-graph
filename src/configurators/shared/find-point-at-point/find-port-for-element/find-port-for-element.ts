import { Graph } from "@/canvas";

export const findPortForElement = (
  graph: Graph<number>,
  element: Element,
): unknown | null => {
  let elementBuf: Element | null = element;
  let draggingPortId: unknown | null = null;

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
