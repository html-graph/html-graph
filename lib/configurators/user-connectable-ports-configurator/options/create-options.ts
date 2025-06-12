import { ConnectablePortsOptions } from "./connectable-ports-options";
import { ConnectionPreprocessor } from "./connection-preprocessor";
import { ConnectionTypeResolver } from "./connection-type-resolver";
import { Options } from "./options";

export const createOptions = (
  connectablePortsOptions: ConnectablePortsOptions,
): Options => {
  const defaultConnectionResolver: ConnectionTypeResolver = () => "direct";

  const defaultConnectionPreprocessor: ConnectionPreprocessor = (request) =>
    request;

  const defaultMouseEventVerifier = (event: MouseEvent): boolean =>
    event.button === 0;

  return {
    connectionTypeResolver:
      connectablePortsOptions.connectionTypeResolver ??
      defaultConnectionResolver,
    connectionPreprocessor:
      connectablePortsOptions.connectionPreprocessor ??
      defaultConnectionPreprocessor,
    mouseDownEventVerifier:
      connectablePortsOptions.mouseDownEventVerifier ??
      defaultMouseEventVerifier,
  };
};
