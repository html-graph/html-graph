import { ConnectablePortsConfig } from "./connectable-ports-config";
import { defaultConnectionTypeResolver } from "./default-connectio-type-resolver";
import { defaultConnectionPreprocessor } from "./default-connection-preprocessor";
import { defaultMouseDownEventVerifier } from "./default-mouse-down-event-verifier";
import { defaultOnAfterEdgeCreated } from "./default-on-after-edge-created";
import { Config } from "./config";
import { defaultMouseUpEventVerifier } from "./default-mouse-up-event-verifier";

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
    mouseUpEventVerifier:
      connectablePortsConfig.mouseUpEventVerifier ??
      defaultMouseUpEventVerifier,
    onAfterEdgeCreated:
      connectablePortsConfig.events?.onAfterEdgeCreated ??
      defaultOnAfterEdgeCreated,
  };
};
