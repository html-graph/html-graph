import {
  ConnectionPreprocessor,
  DraggingEdgeResolver,
  MouseEventVerifier,
} from "@/configurators";
import { EdgeShapeConfig } from "../resolve-edge-shape-factory";
import { AddEdgeRequest } from "@/canvas";
import { GenericGraphEdge } from "@/generic-graph";

export interface DraggableEdgesConfig {
  readonly connectionPreprocessor?: ConnectionPreprocessor;
  readonly mouseDownEventVerifier?: MouseEventVerifier;
  readonly mouseUpEventVerifier?: MouseEventVerifier;
  readonly draggingEdgeResolver?: DraggingEdgeResolver;
  readonly draggingEdgeShape?: EdgeShapeConfig;
  readonly events?: {
    readonly onAfterEdgeReattached?: (edgeId: unknown) => void;
    readonly onEdgeReattachInterrupted?: (edge: GenericGraphEdge) => void;
    readonly onEdgeReattachPrevented?: (request: AddEdgeRequest) => void;
  };
}
