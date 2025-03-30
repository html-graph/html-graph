import { standardCenterFn } from "@/center-fn";
import { resolvePriority } from "./resolve-priority";
import { resolveEdgeShapeFactory } from "./resolve-edge-shape-factory";
import { Defaults } from "./graph-defaults";
import { CanvasDefaults } from "..";

export const createDefaults: (
  canvasDefaults: CanvasDefaults | undefined,
) => Defaults = (apiOptions: CanvasDefaults | undefined) => {
  const priorities = resolvePriority(
    apiOptions?.nodes?.priority,
    apiOptions?.edges?.priority,
  );

  return {
    nodes: {
      centerFn: apiOptions?.nodes?.centerFn ?? standardCenterFn,
      priorityFn: priorities.nodesPriorityFn,
    },
    ports: {
      direction: apiOptions?.ports?.direction ?? 0,
    },
    edges: {
      shapeFactory: resolveEdgeShapeFactory(apiOptions?.edges?.shape ?? {}),
      priorityFn: priorities.edgesPriorityFn,
    },
  };
};
