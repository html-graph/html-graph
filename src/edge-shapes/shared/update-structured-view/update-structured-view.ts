import { StructuredEdgeShapeModel } from "../structured-edge-shape-model";
import { StructuredView } from "../structured-view";
import { setSvgRectangle } from "../svg";

export const updateStructuredView = (
  view: StructuredView,
  model: StructuredEdgeShapeModel,
): void => {
  setSvgRectangle(view.element, model.box);

  view.line.setAttribute("d", model.linePath);

  if (view.sourceArrow !== null) {
    view.sourceArrow.setAttribute("d", model.sourceArrowPath);
  }

  if (view.targetArrow !== null) {
    view.targetArrow.setAttribute("d", model.targetArrowPath);
  }
};
