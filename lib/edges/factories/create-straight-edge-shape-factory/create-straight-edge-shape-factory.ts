import { StraightEdgeParams, StraightEdgeShape } from "../../shapes";
import { EdgeShapeFactory } from "../edge-shape-factory";

export const createStraightEdgeShareFactory: (
  options: StraightEdgeParams,
) => EdgeShapeFactory = (options) => () => {
  return new StraightEdgeShape(options);
};
