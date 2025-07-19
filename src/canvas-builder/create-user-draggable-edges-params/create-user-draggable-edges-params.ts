import {
  DraggingEdgeResolver,
  UserDraggableEdgesParams,
} from "@/configurators";
import { DraggableEdgesConfig } from "./draggable-edges-config";
import { Canvas, EdgeShapeFactory } from "@/canvas";
import { resolveEdgeShapeFactory } from "../resolve-edge-shape-factory";

export const createUserDraggableEdgeParams = (
  config: DraggableEdgesConfig,
  defaultEdgeShapeFactory: EdgeShapeFactory,
  canvas: Canvas,
): UserDraggableEdgesParams => {
  const defaultMouseDownEventVerifier = (event: MouseEvent): boolean =>
    event.button === 0 && event.ctrlKey;

  const defaultMouseUpEventVerifier = (event: MouseEvent): boolean =>
    event.button === 0;

  const defaultDraggingEdgeResolver: DraggingEdgeResolver = (portId) => {
    const edgeIds = canvas.graph.getPortAdjacentEdgeIds(portId)!;

    if (edgeIds.length > 0) {
      return edgeIds[0];
    } else {
      return null;
    }
  };

  return {
    mouseDownEventVerifier:
      config.mouseDownEventVerifier ?? defaultMouseDownEventVerifier,
    mouseUpEventVerifier:
      config.mouseUpEventVerifier ?? defaultMouseUpEventVerifier,
    draggingEdgeResolver: defaultDraggingEdgeResolver,
    edgeShapeFactory:
      config.edgeShape !== undefined
        ? resolveEdgeShapeFactory(config.edgeShape)
        : defaultEdgeShapeFactory,
  };
};
