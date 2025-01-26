import { EdgeShape } from "../shapes";
import { EdgeType } from "./edge-type";

export type EdgeShapeFactory = (type: EdgeType) => EdgeShape;
