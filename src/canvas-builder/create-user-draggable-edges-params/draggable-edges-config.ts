import { MouseEventVerifier } from "@/configurators";
import { EdgeShapeConfig } from "../resolve-edge-shape-factory";

export interface DraggableEdgesConfig {
  readonly mouseDownEventVerifier?: MouseEventVerifier;
  readonly edgeShape?: EdgeShapeConfig;
}
