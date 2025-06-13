import { ConnectablePortsOptions } from "./connectable-ports-options";
import { defaultConnectionTypeResolver } from "./default-connectio-type-resolver";
import { defaultConnectionPreprocessor } from "./default-connection-preprocessor";
import { defaultMouseDownEventVerifier } from "./default-mouse-down-event-verifier";
import { defaultOnEdgeCreated } from "./default-on-edge-created";
import { Options } from "./options";

export const createOptions = (
  connectablePortsOptions: ConnectablePortsOptions,
): Options => {
  return {
    connectionTypeResolver:
      connectablePortsOptions.connectionTypeResolver ??
      defaultConnectionTypeResolver,
    connectionPreprocessor:
      connectablePortsOptions.connectionPreprocessor ??
      defaultConnectionPreprocessor,
    mouseDownEventVerifier:
      connectablePortsOptions.mouseDownEventVerifier ??
      defaultMouseDownEventVerifier,
    onEdgeCreated:
      connectablePortsOptions.events?.onEdgeCreated ?? defaultOnEdgeCreated,
  };
};
