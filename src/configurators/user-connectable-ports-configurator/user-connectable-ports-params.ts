import { ConnectionTypeResolver } from "./connection-type-resolver";
import { ConnectionPreprocessor, MouseEventVerifier } from "../shared";
import { AddEdgeRequest, EdgeShapeFactory } from "@/canvas";

export interface UserConnectablePortsParams {
  readonly edgeShapeFactory: EdgeShapeFactory;
  readonly connectionTypeResolver: ConnectionTypeResolver;
  readonly connectionPreprocessor: ConnectionPreprocessor;
  readonly mouseDownEventVerifier: MouseEventVerifier;
  readonly mouseUpEventVerifier: MouseEventVerifier;
  readonly onAfterEdgeCreated: (edgeId: unknown) => void;
  readonly onEdgeCreationInterrupted: (params: {
    readonly staticPortId: unknown;
    readonly isDirect: boolean;
  }) => void;
  readonly onEdgeCreationPrevented: (request: AddEdgeRequest) => void;
  readonly dragPortDirection: number;
}
