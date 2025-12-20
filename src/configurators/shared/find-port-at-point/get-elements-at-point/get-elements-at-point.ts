import { Point } from "@/point";

export const getElementsAtPoint = (
  root: DocumentOrShadowRoot,
  point: Point,
): readonly Element[] => {
  return root
    .elementsFromPoint(point.x, point.y)
    .map((element) => {
      if (element.shadowRoot !== null) {
        return [...getElementsAtPoint(element.shadowRoot, point), element];
      }

      return [element];
    })
    .flat();
};
