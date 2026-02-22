import { standardCenterFn } from "@/center-fn";
import { resolvePriority } from "./resolve-priority";
import { resolveEdgeShapeFactory } from "../resolve-edge-shape-factory";
import { CanvasDefaults } from "../shared";
import { GraphControllerParams } from "@/graph-controller";

export const createGraphControllerParams = (
  canvasDefaults: CanvasDefaults,
): GraphControllerParams => {
  const priorities = resolvePriority(
    canvasDefaults.nodes?.priority,
    canvasDefaults.edges?.priority,
  );

  return {
    nodes: {
      centerFn: canvasDefaults.nodes?.centerFn ?? standardCenterFn,
      priorityFn: priorities.nodesPriorityFn,
    },
    ports: {
      direction: canvasDefaults.ports?.direction ?? 0,
    },
    edges: {
      shapeFactory: resolveEdgeShapeFactory(canvasDefaults.edges?.shape ?? {}),
      priorityFn: priorities.edgesPriorityFn,
    },
  };
};
