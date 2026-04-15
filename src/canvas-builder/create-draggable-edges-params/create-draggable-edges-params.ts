import { DraggingEdgeResolver, DraggableEdgesParams } from "@/configurators";
import { DraggableEdgesConfig } from "./draggable-edges-config";
import { resolveEdgeShapeFactory } from "../resolve-edge-shape-factory";
import { Identifier } from "@/identifier";
import { Graph } from "@/graph";
import { defaults } from "./defaults";

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

  const defaultOnAfterEdgeReattached: (edgeId: Identifier) => void = () => {};

  const defaultOnAfterEdgeReattachPrevented = (): void => {};

  const defaultOnAfterEdgeReattachInterrupted = (): void => {};

  return {
    connectionPreprocessor:
      config.connectionPreprocessor ?? defaults.connectionPreprocessor,
    connectionAllowedVerifier:
      config.connectionAllowedVerifier ?? defaults.connectionAllowedVerifier,
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
    onAfterEdgeReattached:
      config.events?.onAfterEdgeReattached ?? defaultOnAfterEdgeReattached,
    onEdgeReattachInterrupted:
      config.events?.onEdgeReattachInterrupted ??
      defaultOnAfterEdgeReattachInterrupted,
    onEdgeReattachPrevented:
      config.events?.onEdgeReattachPrevented ??
      defaultOnAfterEdgeReattachPrevented,
  };
};
