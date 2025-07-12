import {
  ConnectionTypeResolver,
  ConnectionPreprocessor,
  UserConnectablePortsParams,
} from "@/configurators";
import { ConnectablePortsConfig } from "./connectable-ports-config";
import { EdgeShapeFactory } from "@/canvas";

export const createUserConnectablePortsParams = (
  connectablePortsConfig: ConnectablePortsConfig,
  defaultEdgeShapeFactory: EdgeShapeFactory,
  defaultDragPortDirection: number,
): UserConnectablePortsParams => {
  const defaultConnectionTypeResolver: ConnectionTypeResolver = () => "direct";

  const defaultConnectionPreprocessor: ConnectionPreprocessor = (request) =>
    request;

  const defaultMouseEventVerifier = (event: MouseEvent): boolean =>
    event.button === 0;

  const defaultOnAfterEdgeCreated: (edgeId: unknown) => void = () => {};

  const defaultOnAfterEdgeConnectionPrevented = (): void => {};

  const defaultOnAfterEdgeConnectionInterrupted = (): void => {};

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
    onEdgeCreationInterrupted:
      connectablePortsConfig.events?.onEdgeCreationInterrupted ??
      defaultOnAfterEdgeConnectionInterrupted,
    onEdgeCreationPrevented:
      connectablePortsConfig.events?.onEdgeCreationPrevented ??
      defaultOnAfterEdgeConnectionPrevented,
    dragPortDirection:
      connectablePortsConfig.dragPortDirection ?? defaultDragPortDirection,
    edgeShapeFactory:
      connectablePortsConfig.edgeShapeFactory ?? defaultEdgeShapeFactory,
  };
};
