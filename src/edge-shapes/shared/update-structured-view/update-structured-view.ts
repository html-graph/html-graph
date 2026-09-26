import { StructuredEdgeModel } from "../structured-edge-shape-model";
import { StructuredEdgeView } from "../structured-view";
import { setSvgRectangle } from "../svg";

export const updateStructuredView = (
  view: StructuredEdgeView,
  model: StructuredEdgeModel,
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
