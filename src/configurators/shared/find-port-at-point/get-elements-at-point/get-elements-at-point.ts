import { Point } from "@/point";

export function* getElementsAtPoint(
  root: DocumentOrShadowRoot,
  point: Point,
): ArrayIterator<Element> {
  const elements = root.elementsFromPoint(point.x, point.y);

  for (const element of elements) {
    if (element.shadowRoot !== null) {
      const shadowElements = getElementsAtPoint(element.shadowRoot, point);

      for (const shadowElement of shadowElements) {
        yield shadowElement;
      }
    }

    yield element;
  }
}
