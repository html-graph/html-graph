import { UserDraggableEdgesParams } from "@/configurators";
import { DraggableEdgesConfig } from "./draggable-edges-config";

export const createUserDraggableEdgeParams = (
  config: DraggableEdgesConfig,
): UserDraggableEdgesParams => {
  const defaultMouseEventVerifier = (event: MouseEvent): boolean =>
    event.button === 0 && event.ctrlKey;

  return {
    mouseDownEventVerifier:
      config.mouseDownEventVerifier ?? defaultMouseEventVerifier,
  };
};
