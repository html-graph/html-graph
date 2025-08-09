import { Identifier } from "@/identifier";

export type DraggingEdgeResolver = (portId: Identifier) => Identifier | null;
