import { StructuredEdgeShape } from "../structured-edge-shape";
import { createEdgeLine } from "./create-edge-line";
import { createEdgeArrow } from "./create-edge-arrow";
import { createEdgeGroup } from "./create-edge-group";

export const configureInteractiveEdge = (
  shape: StructuredEdgeShape,
  distance: number,
): void => {
  const interactiveGroup = createEdgeGroup();
  const interactiveLine = createEdgeLine(distance);
  interactiveGroup.appendChild(interactiveLine);

  let interactiveSourceArrow: SVGPathElement | null = null;

  if (shape.view.sourceArrow !== null) {
    interactiveSourceArrow = createEdgeArrow(distance);
    interactiveGroup.appendChild(interactiveSourceArrow);
  }

  let interactiveTargetArrow: SVGPathElement | null = null;

  if (shape.view.targetArrow !== null) {
    interactiveTargetArrow = createEdgeArrow(distance);
    interactiveGroup.appendChild(interactiveTargetArrow);
  }

  shape.view.group.appendChild(interactiveGroup);

  shape.onModelChange.subscribe((model) => {
    interactiveLine.setAttribute("d", model.linePath);

    if (interactiveSourceArrow !== null) {
      interactiveSourceArrow.setAttribute("d", model.sourceArrowPath);
    }

    if (interactiveTargetArrow !== null) {
      interactiveTargetArrow.setAttribute("d", model.targetArrowPath);
    }
  });
};
