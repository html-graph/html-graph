import { StructuredEdgeShapeModel } from "../structured-edge-shape-model";
import { StructuredView } from "../structured-view";
import { setSvgRectangle } from "../svg";

export const updateStructuredView = (
  view: StructuredView,
  model: StructuredEdgeShapeModel,
): void => {
  const { box, line } = model;

  setSvgRectangle(view.element, box);

  view.line.setAttribute("d", line.path);

  if (view.sourceArrow !== null) {
    view.sourceArrow.setAttribute("d", model.source.arrowPath);
  }

  if (view.targetArrow !== null) {
    view.targetArrow.setAttribute("d", model.target.arrowPath);
  }
};
