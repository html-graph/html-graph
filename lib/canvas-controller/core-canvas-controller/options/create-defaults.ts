import { standardCenterFn } from "@/center-fn";
import { CoreOptions } from "./core-options";
import { resolveEdgeShapeFactory } from "./resolve-edge-shape-factory";
import { resolvePriority } from "./resolve-priority";
import { GraphDefaults } from "@/canvas";

export const createDefaults: (
  coreOptions: CoreOptions | undefined,
) => GraphDefaults = (apiOptions: CoreOptions | undefined) => {
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
