import { MouseEventVerifier } from "../../shared";
import { ConnectionPreprocessor } from "./connection-preprocessor";
import { ConnectionTypeResolver } from "./connection-type-resolver";

export interface ConnectablePortsConfig {
  readonly connectionTypeResolver?: ConnectionTypeResolver;
  readonly connectionPreprocessor?: ConnectionPreprocessor;
  readonly mouseDownEventVerifier?: MouseEventVerifier;
  readonly mouseUpEventVerifier?: MouseEventVerifier;
  readonly events?: {
    readonly onAfterEdgeCreated?: (edgeId: unknown) => void;
  };
}
