import { ConnectionPreprocessor } from "./connection-preprocessor";
import { ConnectionTypeResolver } from "./connection-type-resolver";
import { MouseEventVerifier } from "../../shared";

export interface Options {
  readonly connectionTypeResolver: ConnectionTypeResolver;
  readonly connectionPreprocessor: ConnectionPreprocessor;
  readonly mouseDownEventVerifier: MouseEventVerifier;
  readonly onAfterEdgeCreated: (edgeId: unknown) => void;
}
