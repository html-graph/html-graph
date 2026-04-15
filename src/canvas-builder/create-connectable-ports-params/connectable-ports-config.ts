import {
  ConnectionAllowedVerifier,
  ConnectionPreprocessor,
  ConnectionTypeResolver,
  MouseEventVerifier,
} from "@/configurators";
import { EdgeShapeConfig } from "../resolve-edge-shape-factory";
import { Identifier } from "@/identifier";
import { AddEdgeRequest } from "@/graph-controller";

export interface ConnectablePortsConfig {
  readonly edgeShape?: EdgeShapeConfig;
  readonly connectionTypeResolver?: ConnectionTypeResolver;
  readonly connectionAllowedVerifier?: ConnectionAllowedVerifier;
  readonly connectionPreprocessor?: ConnectionPreprocessor;
  readonly mouseDownEventVerifier?: MouseEventVerifier;
  readonly mouseUpEventVerifier?: MouseEventVerifier;
  readonly dragPortDirection?: number | undefined;
  readonly events?: {
    readonly onAfterEdgeCreated?: (edgeId: Identifier) => void;
    readonly onEdgeCreationInterrupted?: (params: {
      readonly staticPortId: Identifier;
      readonly isDirect: boolean;
    }) => void;
    readonly onEdgeCreationPrevented?: (request: AddEdgeRequest) => void;
  };
}
