import { standardCenterFn } from "@/center-fn";
import { resolvePriority } from "./resolve-priority";
import { resolveEdgeShapeFactory } from "../resolve-edge-shape-factory";
import { CanvasDefaults } from "./canvas-defaults";
import { CanvasParams } from "@/canvas";

export const createCanvasParams = (defaults: CanvasDefaults): CanvasParams => {
  const priorities = resolvePriority(
    defaults.nodes?.priority,
    defaults.edges?.priority,
  );

  return {
    nodes: {
      centerFn: defaults.nodes?.centerFn ?? standardCenterFn,
      priorityFn: priorities.nodesPriorityFn,
    },
    ports: {
      direction: defaults.ports?.direction ?? 0,
    },
    edges: {
      shapeFactory: resolveEdgeShapeFactory(defaults.edges?.shape ?? {}),
      priorityFn: priorities.edgesPriorityFn,
    },
    focus: {
      contentOffset: defaults.focus?.contentOffset ?? 100,
      minContentScale: defaults.focus?.minContentScale ?? 0,
    },
  };
};
