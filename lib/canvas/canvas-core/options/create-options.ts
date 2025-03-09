import { standardCenterFn } from "@/center-fn";
import { CoreOptions } from "./core-options";
import { resolveEdgeShapeFactory } from "./resolve-edge-shape-factory";
import { resolvePriority } from "./resolve-priority";
import { GraphStoreControllerOptions } from "@/graph-store-controller";

export const createOptions: (
  apiOptions: CoreOptions | undefined,
) => GraphStoreControllerOptions = (apiOptions: CoreOptions | undefined) => {
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
