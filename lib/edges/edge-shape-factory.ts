import { EdgeShape } from "./edge-shape";
import { EdgeType } from "./edge-type";

export type EdgeShapeFactory = (type: EdgeType) => EdgeShape;
