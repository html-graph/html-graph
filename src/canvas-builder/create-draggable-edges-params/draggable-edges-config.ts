import {
  ConnectionPreprocessor,
  DraggingEdgeResolver,
  MouseEventVerifier,
} from "@/configurators";
import { EdgeShapeConfig } from "../resolve-edge-shape-factory";
import { AddEdgeRequest, GraphEdge } from "@/canvas";
import { Identifier } from "@/identifier";

export interface DraggableEdgesConfig {
  readonly connectionPreprocessor?: ConnectionPreprocessor;
  readonly mouseDownEventVerifier?: MouseEventVerifier;
  readonly mouseUpEventVerifier?: MouseEventVerifier;
  readonly draggingEdgeResolver?: DraggingEdgeResolver;
  readonly draggingEdgeShape?: EdgeShapeConfig;
  readonly events?: {
    readonly onAfterEdgeReattached?: (edgeId: Identifier) => void;
    readonly onEdgeReattachInterrupted?: (edge: GraphEdge) => void;
    readonly onEdgeReattachPrevented?: (request: AddEdgeRequest) => void;
  };
}
