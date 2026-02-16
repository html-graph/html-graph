import { EdgeShape } from "@/edges";
import { Identifier } from "@/identifier";

export type EdgeShapeFactory = (edgeId: Identifier) => EdgeShape;
