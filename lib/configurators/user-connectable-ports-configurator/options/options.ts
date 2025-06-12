import { ConnectionPreprocessor } from "./connection-preprocessor";
import { ConnectionTypeResolver } from "./connection-type-resolver";

export interface Options {
  readonly connectionTypeResolver: ConnectionTypeResolver;
  readonly connectionPreprocessor: ConnectionPreprocessor;
  readonly mouseDownEventVerifier: (event: MouseEvent) => boolean;
}
