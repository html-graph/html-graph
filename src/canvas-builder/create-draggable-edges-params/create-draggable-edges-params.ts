import { DraggingEdgeResolver, DraggableEdgesParams } from "@/configurators";
import { DraggableEdgesConfig } from "./draggable-edges-config";
import { Graph } from "@/graph";
import { defaults } from "./defaults";
import {
  noopFn,
  resolveDraggingPortDirectionResolver,
  resolveEdgeShapeFactory,
} from "../shared";

export const createDraggableEdgeParams = (
  config: DraggableEdgesConfig,
  graph: Graph,
): DraggableEdgesParams => {
  const defaultDraggingEdgeResolver: DraggingEdgeResolver = (portId) => {
    const edgeIds = graph.getPortAdjacentEdgeIds(portId);

    if (edgeIds.length > 0) {
      return edgeIds[edgeIds.length - 1];
    } else {
      return null;
    }
  };

  const connectionAllowedVerifier =
    config.connectionAllowedVerifier ?? defaults.connectionAllowedVerifier;

  return {
    connectionPreprocessor:
      config.connectionPreprocessor ?? defaults.connectionPreprocessor,
    connectionAllowedVerifier,
    mouseDownEventVerifier:
      config.mouseDownEventVerifier ?? defaults.mouseDownEventVerifier,
    mouseUpEventVerifier:
      config.mouseUpEventVerifier ?? defaults.mouseUpEventVerifier,
    draggingEdgeResolver:
      config.draggingEdgeResolver ?? defaultDraggingEdgeResolver,
    draggingEdgeShapeFactory:
      config.draggingEdgeShape !== undefined
        ? resolveEdgeShapeFactory(config.draggingEdgeShape)
        : null,
    onAfterEdgeReattached: config.events?.onAfterEdgeReattached ?? noopFn,
    onEdgeReattachInterrupted:
      config.events?.onEdgeReattachInterrupted ?? noopFn,
    onEdgeReattachPrevented: config.events?.onEdgeReattachPrevented ?? noopFn,
    draggingPortDirectionResolver: resolveDraggingPortDirectionResolver(
      config.dragPortDirection,
      graph,
      connectionAllowedVerifier,
    ),
  };
};
