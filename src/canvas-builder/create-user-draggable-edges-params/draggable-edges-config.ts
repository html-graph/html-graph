import { DraggingEdgeResolver, MouseEventVerifier } from "@/configurators";
import { EdgeShapeConfig } from "../resolve-edge-shape-factory";

export interface DraggableEdgesConfig {
  readonly mouseDownEventVerifier?: MouseEventVerifier;
  readonly mouseUpEventVerifier?: MouseEventVerifier;
  readonly draggingEdgeResolver?: DraggingEdgeResolver;
  readonly edgeShape?: EdgeShapeConfig;
}
