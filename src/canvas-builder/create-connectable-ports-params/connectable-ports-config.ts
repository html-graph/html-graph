import { AddEdgeRequest } from "@/canvas";
import {
  ConnectionPreprocessor,
  ConnectionTypeResolver,
  MouseEventVerifier,
} from "@/configurators";
import { EdgeShapeConfig } from "../resolve-edge-shape-factory";

export interface ConnectablePortsConfig {
  readonly edgeShape?: EdgeShapeConfig;
  readonly connectionTypeResolver?: ConnectionTypeResolver;
  readonly connectionPreprocessor?: ConnectionPreprocessor;
  readonly mouseDownEventVerifier?: MouseEventVerifier;
  readonly mouseUpEventVerifier?: MouseEventVerifier;
  readonly dragPortDirection?: number | undefined;
  readonly events?: {
    readonly onAfterEdgeCreated?: (edgeId: unknown) => void;
    readonly onEdgeCreationInterrupted?: (params: {
      readonly staticPortId: unknown;
      readonly isDirect: boolean;
    }) => void;
    readonly onEdgeCreationPrevented?: (request: AddEdgeRequest) => void;
  };
}
