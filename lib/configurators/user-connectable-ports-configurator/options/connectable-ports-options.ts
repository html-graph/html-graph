import { ConnectionPreprocessor } from "./connection-preprocessor";
import { ConnectionTypeResolver } from "./connection-type-resolver";

export interface ConnectablePortsOptions {
  readonly connectionTypeResolver?: ConnectionTypeResolver;
  readonly connectionPreprocessor?: ConnectionPreprocessor;
}
