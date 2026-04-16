import { UserConnectablePortsParams } from "@/configurators";
import { ConnectablePortsConfig } from "./connectable-ports-config";
import { EdgeShapeFactory } from "@/graph-controller";
import { defaults } from "./defaults";
import { noopFn, resolveEdgeShapeFactory } from "../shared";

export const createConnectablePortsParams = (
  config: ConnectablePortsConfig,
  defaultEdgeShapeFactory: EdgeShapeFactory,
): UserConnectablePortsParams => {
  return {
    connectionTypeResolver:
      config.connectionTypeResolver ?? defaults.connectionTypeResolver,
    connectionAllowedVerifier:
      config.connectionAllowedVerifier ?? defaults.connectionAllowedVerifier,
    dragPortDirection: config.dragPortDirection,
    edgeShapeFactory:
      config.edgeShape !== undefined
        ? resolveEdgeShapeFactory(config.edgeShape)
        : defaultEdgeShapeFactory,
    connectionPreprocessor:
      config.connectionPreprocessor ?? defaults.connectionPreprocessor,
    mouseDownEventVerifier:
      config.mouseDownEventVerifier ?? defaults.mouseEventVerifier,
    mouseUpEventVerifier:
      config.mouseUpEventVerifier ?? defaults.mouseEventVerifier,
    onAfterEdgeCreated: config.events?.onAfterEdgeCreated ?? noopFn,
    onEdgeCreationInterrupted:
      config.events?.onEdgeCreationInterrupted ?? noopFn,
    onEdgeCreationPrevented: config.events?.onEdgeCreationPrevented ?? noopFn,
  };
};
