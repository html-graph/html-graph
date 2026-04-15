import {
  ConnectionAllowedVerifier,
  ConnectionPreprocessor,
  DraggingEdgeResolver,
  MouseEventVerifier,
} from "@/configurators";
import { EdgeShapeConfig } from "../resolve-edge-shape-factory";
import { GraphEdge } from "@/graph";
import { Identifier } from "@/identifier";
import { AddEdgeRequest } from "@/graph-controller";

export interface DraggableEdgesConfig {
  readonly connectionPreprocessor?: ConnectionPreprocessor;
  readonly connectionAllowedVerifier?: ConnectionAllowedVerifier;
  readonly mouseDownEventVerifier?: MouseEventVerifier;
  readonly mouseUpEventVerifier?: MouseEventVerifier;
  readonly draggingEdgeResolver?: DraggingEdgeResolver;
  readonly draggingEdgeShape?: EdgeShapeConfig;
  readonly events?: {
    readonly onAfterEdgeReattached?: (edgeId: Identifier) => void;
    // TODO: create type for parameter
    readonly onEdgeReattachInterrupted?: (
      edge: GraphEdge & { readonly id: Identifier },
    ) => void;
    readonly onEdgeReattachPrevented?: (request: AddEdgeRequest) => void;
  };
}
