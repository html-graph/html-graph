import {
  ConnectionAllowedVerifier,
  ConnectionPreprocessor,
  DraggingEdgeResolver,
  MouseEventVerifier,
  PortIdResolver,
} from "@/configurators";
import { DraggingPortDirectionConfig, EdgeShapeConfig } from "../shared";
import { GraphEdge } from "@/graph";
import { Identifier } from "@/identifier";
import { AddEdgeRequest } from "@/graph-controller";

export interface DraggableEdgesConfig {
  readonly connectionPreprocessor?: ConnectionPreprocessor | undefined;
  readonly connectionAllowedVerifier?: ConnectionAllowedVerifier | undefined;
  readonly mouseDownEventVerifier?: MouseEventVerifier | undefined;
  readonly mouseUpEventVerifier?: MouseEventVerifier | undefined;
  readonly draggingEdgeResolver?: DraggingEdgeResolver | undefined;
  readonly draggingEdgeShape?: EdgeShapeConfig | undefined;
  readonly dragPortDirection?: DraggingPortDirectionConfig | undefined;
  readonly grabbedPortIdResolver?: PortIdResolver | undefined;
  readonly releasedPortIdResolver?: PortIdResolver | undefined;
  readonly events?: {
    readonly onAfterEdgeReattached?: (edgeId: Identifier) => void;
    // TODO: create type for parameter
    readonly onEdgeReattachInterrupted?: (
      edge: GraphEdge & { readonly id: Identifier },
    ) => void;
    readonly onEdgeReattachPrevented?: (request: AddEdgeRequest) => void;
  };
}
