import {
  ConnectionAllowedVerifier,
  ConnectionPreprocessor,
  ConnectionTypeResolver,
  EdgeCreationInProgressParams,
  MouseEventVerifier,
} from "@/configurators";
import { DraggingPortDirectionConfig, EdgeShapeConfig } from "../shared";
import { Identifier } from "@/identifier";
import { AddEdgeRequest } from "@/graph-controller";

export interface ConnectablePortsConfig {
  readonly edgeShape?: EdgeShapeConfig;
  readonly connectionTypeResolver?: ConnectionTypeResolver;
  readonly connectionAllowedVerifier?: ConnectionAllowedVerifier;
  readonly connectionPreprocessor?: ConnectionPreprocessor;
  readonly mouseDownEventVerifier?: MouseEventVerifier;
  readonly mouseUpEventVerifier?: MouseEventVerifier;
  readonly dragPortDirection?: DraggingPortDirectionConfig;
  readonly events?: {
    readonly onAfterEdgeCreated?: (edgeId: Identifier) => void;
    readonly onEdgeCreationInterrupted?: (
      params: EdgeCreationInProgressParams,
    ) => void;
    readonly onEdgeCreationPrevented?: (request: AddEdgeRequest) => void;
  };
}
