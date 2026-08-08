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
import { PortIdResolver } from "@/configurators/shared";

export interface ConnectablePortsConfig {
  readonly edgeShape?: EdgeShapeConfig | undefined;
  readonly connectionTypeResolver?: ConnectionTypeResolver | undefined;
  readonly connectionAllowedVerifier?: ConnectionAllowedVerifier | undefined;
  readonly connectionPreprocessor?: ConnectionPreprocessor | undefined;
  readonly mouseDownEventVerifier?: MouseEventVerifier | undefined;
  readonly mouseUpEventVerifier?: MouseEventVerifier | undefined;
  readonly dragPortDirection?: DraggingPortDirectionConfig | undefined;
  readonly grabbedPortIdResolver?: PortIdResolver | undefined;
  readonly releasedPortIdResolver?: PortIdResolver | undefined;
  readonly events?: {
    readonly onAfterEdgeCreated?: (edgeId: Identifier) => void;
    readonly onEdgeCreationInterrupted?: (
      params: EdgeCreationInProgressParams,
    ) => void;
    readonly onEdgeCreationPrevented?: (request: AddEdgeRequest) => void;
  };
}
