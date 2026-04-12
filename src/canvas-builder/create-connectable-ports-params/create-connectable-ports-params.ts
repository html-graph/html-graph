import { UserConnectablePortsParams } from "@/configurators";
import { ConnectablePortsConfig } from "./connectable-ports-config";
import { resolveEdgeShapeFactory } from "../resolve-edge-shape-factory";
import { EdgeShapeFactory } from "@/graph-controller";
import { defaults } from "./defaults";

export const createConnectablePortsParams = (
  config: ConnectablePortsConfig,
  defaultEdgeShapeFactory: EdgeShapeFactory,
  defaultDragPortDirection: number,
): UserConnectablePortsParams => {
  return {
    connectionTypeResolver:
      config.connectionTypeResolver ?? defaults.connectionTypeResolver,
    connectionPreprocessor:
      config.connectionPreprocessor ?? defaults.connectionPreprocessor,
    mouseDownEventVerifier:
      config.mouseDownEventVerifier ?? defaults.mouseEventVerifier,
    mouseUpEventVerifier:
      config.mouseUpEventVerifier ?? defaults.mouseEventVerifier,
    onAfterEdgeCreated:
      config.events?.onAfterEdgeCreated ?? defaults.onAfterEdgeCreated,
    onEdgeCreationInterrupted:
      config.events?.onEdgeCreationInterrupted ??
      defaults.onEdgeCreationInterrupted,
    onEdgeCreationPrevented:
      config.events?.onEdgeCreationPrevented ??
      defaults.onEdgeCreationPrevented,
    dragPortDirection: config.dragPortDirection ?? defaultDragPortDirection,
    edgeShapeFactory:
      config.edgeShape !== undefined
        ? resolveEdgeShapeFactory(config.edgeShape)
        : defaultEdgeShapeFactory,
  };
};
