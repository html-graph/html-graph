import { CanvasParams } from "@/canvas";
import { standardCenterFn } from "@/center-fn";
import { BezierEdgeShape } from "@/edges";

export const defaultCanvasParams: CanvasParams = {
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
