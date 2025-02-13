import { BezierEdgeParams, BezierEdgeShape } from "../../shapes";
import { EdgeShapeFactory } from "../edge-shape-factory";

export const createBezierEdgeShapeFactory: (
  options: BezierEdgeParams,
) => EdgeShapeFactory = (options) => () => {
  return new BezierEdgeShape(options);
};
