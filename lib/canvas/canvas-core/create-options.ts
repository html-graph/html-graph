import { standardCenterFn } from "@/center-fn";
import { CoreOptions } from "./core-options";
import { Options } from "./options";
import { resolveEdgeShapeFactory } from "./resolve-edge-shape-factory";
import { resolvePriority } from "./resolve-priority";

export const createOptions: (apiOptions: CoreOptions) => Options = (
  apiOptions: CoreOptions,
) => {
  const [nodesPriority, edgesPriority] = resolvePriority(
    apiOptions.nodes?.priority,
    apiOptions.edges?.priority,
  );

  return {
    nodes: {
      centerFn: apiOptions.nodes?.centerFn ?? standardCenterFn,
      priorityFn: nodesPriority,
    },
    ports: {
      centerFn: apiOptions.ports?.centerFn ?? standardCenterFn,
      direction: apiOptions.ports?.direction ?? 0,
    },
    edges: {
      shapeFactory: resolveEdgeShapeFactory(apiOptions.edges?.shape ?? {}),
      priorityFn: edgesPriority,
    },
  };
};
