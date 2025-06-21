import { ConnectablePortsConfig } from "./connectable-ports-config";
import { defaultOnAfterEdgeCreated } from "./default-on-after-edge-created";
import { Config } from "./config";
import { ConnectionTypeResolver } from "./connection-type-resolver";
import { ConnectionPreprocessor } from "./connection-preprocessor";

export const createConfig = (
  connectablePortsConfig: ConnectablePortsConfig,
): Config => {
  const defaultConnectionTypeResolver: ConnectionTypeResolver = () => "direct";

  const defaultConnectionPreprocessor: ConnectionPreprocessor = (request) =>
    request;

  const defaultMouseEventVerifier = (event: MouseEvent): boolean =>
    event.button === 0;

  return {
    connectionTypeResolver:
      connectablePortsConfig.connectionTypeResolver ??
      defaultConnectionTypeResolver,
    connectionPreprocessor:
      connectablePortsConfig.connectionPreprocessor ??
      defaultConnectionPreprocessor,
    mouseDownEventVerifier:
      connectablePortsConfig.mouseDownEventVerifier ??
      defaultMouseEventVerifier,
    mouseUpEventVerifier:
      connectablePortsConfig.mouseUpEventVerifier ?? defaultMouseEventVerifier,
    onAfterEdgeCreated:
      connectablePortsConfig.events?.onAfterEdgeCreated ??
      defaultOnAfterEdgeCreated,
    dragPortDirection: connectablePortsConfig.dragPortDirection ?? undefined,
  };
};
