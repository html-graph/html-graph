import { StructuredEdgeShape } from "../structured-edge-shape";

export const configureMidpoint = (
  shape: StructuredEdgeShape,
  midpointElement: HTMLElement | SVGElement,
): void => {
  shape.element.append(midpointElement);

  shape.onModelChange.subscribe((model) => {
    const midpoint = model.calculateMidpoint();
    const transform = `translate(${midpoint.x}px, ${midpoint.y}px)`;

    midpointElement.style.setProperty("transform", transform);
  });
};
