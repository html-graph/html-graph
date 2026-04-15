import { UserConnectablePortsParams } from "@/configurators";
import { ConnectablePortsConfig } from "./connectable-ports-config";
import { resolveEdgeShapeFactory } from "../resolve-edge-shape-factory";
import { EdgeShapeFactory } from "@/graph-controller";
import { defaults } from "./defaults";
import { noopFn } from "../shared";

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
    connectionAllowedVerifier:
      config.connectionAllowedVerifier ?? defaults.connectionAllowedVerifier,
    mouseDownEventVerifier:
      config.mouseDownEventVerifier ?? defaults.mouseEventVerifier,
    mouseUpEventVerifier:
      config.mouseUpEventVerifier ?? defaults.mouseEventVerifier,
    onAfterEdgeCreated: config.events?.onAfterEdgeCreated ?? noopFn,
    onEdgeCreationInterrupted:
      config.events?.onEdgeCreationInterrupted ?? noopFn,
    onEdgeCreationPrevented: config.events?.onEdgeCreationPrevented ?? noopFn,
    dragPortDirection: config.dragPortDirection ?? defaultDragPortDirection,
    edgeShapeFactory:
      config.edgeShape !== undefined
        ? resolveEdgeShapeFactory(config.edgeShape)
        : defaultEdgeShapeFactory,
  };
};
