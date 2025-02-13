import { HorizontalEdgeParams, HorizontalEdgeShape } from "../../shapes";
import { EdgeShapeFactory } from "../edge-shape-factory";

export const createHorizontalEdgeShapeFactory: (
  options: HorizontalEdgeParams,
) => EdgeShapeFactory = (options) => () => {
  return new HorizontalEdgeShape(options);
};
