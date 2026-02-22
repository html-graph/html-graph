import { standardCenterFn } from "@/center-fn";
import { BezierEdgeShape } from "@/edges";
import { GraphControllerParams } from "@/graph-controller";

export const defaultGraphControllerParams: GraphControllerParams = {
  nodes: {
    centerFn: standardCenterFn,
    priorityFn: () => 0,
  },
  ports: {
    direction: 0,
  },
  edges: {
    shapeFactory: () => new BezierEdgeShape(),
    priorityFn: () => 0,
  },
};
