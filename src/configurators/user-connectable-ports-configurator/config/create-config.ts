import { ConnectablePortsConfig } from "./connectable-ports-config";
import { defaultConnectionTypeResolver } from "./default-connectio-type-resolver";
import { defaultConnectionPreprocessor } from "./default-connection-preprocessor";
import { defaultMouseDownEventVerifier } from "./default-mouse-down-event-verifier";
import { defaultOnAfterEdgeCreated } from "./default-on-after-edge-created";
import { Config } from "./config";

export const createConfig = (
  connectablePortsConfig: ConnectablePortsConfig,
): Config => {
  return {
    connectionTypeResolver:
      connectablePortsConfig.connectionTypeResolver ??
      defaultConnectionTypeResolver,
    connectionPreprocessor:
      connectablePortsConfig.connectionPreprocessor ??
      defaultConnectionPreprocessor,
    mouseDownEventVerifier:
      connectablePortsConfig.mouseDownEventVerifier ??
      defaultMouseDownEventVerifier,
    onAfterEdgeCreated:
      connectablePortsConfig.events?.onAfterEdgeCreated ??
      defaultOnAfterEdgeCreated,
  };
};
