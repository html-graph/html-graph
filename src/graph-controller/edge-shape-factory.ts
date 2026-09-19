import { EdgeShape } from "@/edge-shapes";
import { Identifier } from "@/identifier";

export type EdgeShapeFactory = (edgeId: Identifier) => EdgeShape;
