import { standardCenterFn } from "@/center-fn";
import { resolvePriority } from "./resolve-priority";
import { resolveEdgeShapeFactory } from "../resolve-edge-shape-factory";
import { CanvasDefaults } from "./canvas-defaults";
import { CanvasParams } from "@/canvas";

export const createCanvasParams = (
  canvasDefaults: CanvasDefaults,
): CanvasParams => {
  const priorities = resolvePriority(
    canvasDefaults.nodes?.priority,
    canvasDefaults.edges?.priority,
  );

  return {
    graphControllerParams: {
      nodes: {
        centerFn: canvasDefaults.nodes?.centerFn ?? standardCenterFn,
        priorityFn: priorities.nodesPriorityFn,
      },
      ports: {
        direction: canvasDefaults.ports?.direction ?? 0,
      },
      edges: {
        shapeFactory: resolveEdgeShapeFactory(
          canvasDefaults.edges?.shape ?? {},
        ),
        priorityFn: priorities.edgesPriorityFn,
      },
    },
    viewportControllerParams: {
      focus: {
        contentOffset: canvasDefaults.focus?.contentOffset ?? 100,
        minContentScale: canvasDefaults.focus?.minContentScale ?? 0,
      },
    },
  };
};
