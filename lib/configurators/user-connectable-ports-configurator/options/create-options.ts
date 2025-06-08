import { ConnectablePortsOptions } from "./connectable-ports-options";
import { ConnectionTypeResolver } from "./connection-type-resolver";
import { Options } from "./options";

export const createOptions = (
  connectablePortsOptions: ConnectablePortsOptions,
): Options => {
  const defaultConnectionResolver: ConnectionTypeResolver = () => "begin";

  return {
    connectionTypeResolver:
      connectablePortsOptions.connectionTypeResolver ??
      defaultConnectionResolver,
  };
};
