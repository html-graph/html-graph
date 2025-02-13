import { VerticalEdgeParams, VerticalEdgeShape } from "../../shapes";
import { EdgeShapeFactory } from "../edge-shape-factory";

export const createVerticalEdgeShapeFactory: (
  options: VerticalEdgeParams,
) => EdgeShapeFactory = (options) => () => {
  return new VerticalEdgeShape(options);
};
