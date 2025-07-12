import { AddEdgeRequest, EdgeShapeFactory } from "@/canvas";
import { MouseEventVerifier } from "../../shared";
import { ConnectionPreprocessor } from "./connection-preprocessor";
import { ConnectionTypeResolver } from "./connection-type-resolver";

export interface ConnectablePortsConfig {
  readonly edgeShapeFactory?: EdgeShapeFactory;
  readonly connectionTypeResolver?: ConnectionTypeResolver;
  readonly connectionPreprocessor?: ConnectionPreprocessor;
  readonly mouseDownEventVerifier?: MouseEventVerifier;
  readonly mouseUpEventVerifier?: MouseEventVerifier;
  readonly dragPortDirection?: number | undefined;
  readonly events?: {
    readonly onAfterEdgeCreated?: (edgeId: unknown) => void;
    readonly onEdgeCreationInterrupted?: (
      staticPortId: unknown,
      isDirect: boolean,
    ) => void;
    readonly onEdgeCreationPrevented?: (request: AddEdgeRequest) => void;
  };
}
