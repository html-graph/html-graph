import { ConnectionTypeResolver } from "./connection-type-resolver";
import {
  ConnectionAllowedVerifier,
  ConnectionPreprocessor,
  MouseEventVerifier,
} from "../shared";
import { Identifier } from "@/identifier";
import { AddEdgeRequest, EdgeShapeFactory } from "@/graph-controller";

export interface UserConnectablePortsParams {
  readonly edgeShapeFactory: EdgeShapeFactory;
  readonly connectionTypeResolver: ConnectionTypeResolver;
  readonly connectionPreprocessor: ConnectionPreprocessor;
  readonly connectionAllowedVerifier: ConnectionAllowedVerifier;
  readonly mouseDownEventVerifier: MouseEventVerifier;
  readonly mouseUpEventVerifier: MouseEventVerifier;
  readonly onAfterEdgeCreated: (edgeId: Identifier) => void;
  readonly onEdgeCreationInterrupted: (params: {
    readonly staticPortId: Identifier;
    readonly isDirect: boolean;
  }) => void;
  readonly onEdgeCreationPrevented: (request: AddEdgeRequest) => void;
  readonly dragPortDirection: number | undefined;
}
