import {
  ConnectionTypeResolver,
  ConnectionPreprocessor,
  UserConnectablePortsParams,
} from "@/configurators";
import { ConnectablePortsConfig } from "./connectable-ports-config";
import { EdgeShapeFactory } from "@/canvas";
import { resolveEdgeShapeFactory } from "../resolve-edge-shape-factory";
import { Identifier } from "@/identifier";

export const createConnectablePortsParams = (
  config: ConnectablePortsConfig,
  defaultEdgeShapeFactory: EdgeShapeFactory,
  defaultDragPortDirection: number,
): UserConnectablePortsParams => {
  const defaultConnectionTypeResolver: ConnectionTypeResolver = () => "direct";

  const defaultConnectionPreprocessor: ConnectionPreprocessor = (request) =>
    request;

  const defaultMouseEventVerifier = (event: MouseEvent): boolean =>
    event.button === 0;

  const defaultOnAfterEdgeCreated: (edgeId: Identifier) => void = () => {};

  const defaultOnAfterEdgeConnectionPrevented = (): void => {};

  const defaultOnAfterEdgeConnectionInterrupted = (): void => {};

  return {
    connectionTypeResolver:
      config.connectionTypeResolver ?? defaultConnectionTypeResolver,
    connectionPreprocessor:
      config.connectionPreprocessor ?? defaultConnectionPreprocessor,
    mouseDownEventVerifier:
      config.mouseDownEventVerifier ?? defaultMouseEventVerifier,
    mouseUpEventVerifier:
      config.mouseUpEventVerifier ?? defaultMouseEventVerifier,
    onAfterEdgeCreated:
      config.events?.onAfterEdgeCreated ?? defaultOnAfterEdgeCreated,
    onEdgeCreationInterrupted:
      config.events?.onEdgeCreationInterrupted ??
      defaultOnAfterEdgeConnectionInterrupted,
    onEdgeCreationPrevented:
      config.events?.onEdgeCreationPrevented ??
      defaultOnAfterEdgeConnectionPrevented,
    dragPortDirection: config.dragPortDirection ?? defaultDragPortDirection,
    edgeShapeFactory:
      config.edgeShape !== undefined
        ? resolveEdgeShapeFactory(config.edgeShape)
        : defaultEdgeShapeFactory,
  };
};
