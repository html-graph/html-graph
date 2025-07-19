import { UserDraggableEdgesParams } from "@/configurators";
import { DraggableEdgesConfig } from "./draggable-edges-config";
import { EdgeShapeFactory } from "@/canvas";
import { resolveEdgeShapeFactory } from "../resolve-edge-shape-factory";

export const createUserDraggableEdgeParams = (
  config: DraggableEdgesConfig,
  defaultEdgeShapeFactory: EdgeShapeFactory,
): UserDraggableEdgesParams => {
  const defaultMouseEventVerifier = (event: MouseEvent): boolean =>
    event.button === 0 && event.ctrlKey;

  return {
    mouseDownEventVerifier:
      config.mouseDownEventVerifier ?? defaultMouseEventVerifier,
    edgeShapeFactory:
      config.edgeShape !== undefined
        ? resolveEdgeShapeFactory(config.edgeShape)
        : defaultEdgeShapeFactory,
  };
};
