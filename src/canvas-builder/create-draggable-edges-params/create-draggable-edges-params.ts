import { DraggingEdgeResolver, DraggableEdgesParams } from "@/configurators";
import { DraggableEdgesConfig } from "./draggable-edges-config";
import { Graph } from "@/graph";
import { resolveEdgeShapeFactory } from "../resolve-edge-shape-factory";
import { ConnectionPreprocessor } from "@/configurators";

export const createDraggableEdgeParams = (
  config: DraggableEdgesConfig,
  graph: Graph<number>,
): DraggableEdgesParams => {
  const defaultConnectionPreprocessor: ConnectionPreprocessor = (request) =>
    request;

  const defaultMouseDownEventVerifier = (event: MouseEvent): boolean =>
    event.button === 0 && event.ctrlKey;

  const defaultMouseUpEventVerifier = (event: MouseEvent): boolean =>
    event.button === 0;

  const defaultDraggingEdgeResolver: DraggingEdgeResolver = (portId) => {
    const edgeIds = graph.getPortAdjacentEdgeIds(portId)!;

    if (edgeIds.length > 0) {
      return edgeIds[edgeIds.length - 1];
    } else {
      return null;
    }
  };

  const defaultOnAfterEdgeReattached: (edgeId: unknown) => void = () => {};

  const defaultOnAfterEdgeReattachPrevented = (): void => {};

  const defaultOnAfterEdgeReattachInterrupted = (): void => {};

  return {
    connectionPreprocessor:
      config.connectionPreprocessor ?? defaultConnectionPreprocessor,
    mouseDownEventVerifier:
      config.mouseDownEventVerifier ?? defaultMouseDownEventVerifier,
    mouseUpEventVerifier:
      config.mouseUpEventVerifier ?? defaultMouseUpEventVerifier,
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
