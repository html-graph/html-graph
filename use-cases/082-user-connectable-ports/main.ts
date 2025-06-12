import { AddNodeRequest, Canvas, CanvasBuilder } from "@html-graph/html-graph";
import { createInOutNode } from "../shared/create-in-out-node";

const builder: CanvasBuilder = new CanvasBuilder();
const canvasElement: HTMLElement = document.getElementById("canvas")!;

const canvas: Canvas = builder
  .setElement(canvasElement)
  .setDefaults({
    edges: {
      shape: {
        hasTargetArrow: true,
      },
    },
  })
  .enableUserDraggableNodes()
  .enableUserConnectablePorts({
    connectionTypeResolver: (portId: unknown) => {
      const idStr = portId as string;

      return idStr.endsWith("-out") ? "direct" : "reverse";
    },
    connectionPreprocessor: (request) => {
      const existingEdge = canvas.graph.getAllEdgeIds().find((edgeId) => {
        const edge = canvas.graph.getEdge(edgeId)!;

        return edge.from === request.from && edge.to === request.to;
      });

      if (existingEdge !== undefined) {
        return null;
      }

      const strFrom = request.from as string;
      const strTo = request.to as string;

      if (strFrom.endsWith("-out") && strTo.endsWith("-in")) {
        return request;
      }

      return null;
    },
  })
  .enableUserTransformableViewport()
  .enableBackground()
  .build();

const addNode1Request: AddNodeRequest = createInOutNode({
  name: "Node 1",
  x: 200,
  y: 400,
  frontPortId: "node-1-in",
  backPortId: "node-1-out",
});

const addNode2Request: AddNodeRequest = createInOutNode({
  name: "Node 2",
  x: 500,
  y: 500,
  frontPortId: "node-2-in",
  backPortId: "node-2-out",
});

const addNode3Request: AddNodeRequest = createInOutNode({
  name: "Node 3",
  x: 700,
  y: 200,
  frontPortId: "node-3-in",
  backPortId: "node-3-out",
});

canvas
  .addNode(addNode1Request)
  .addNode(addNode2Request)
  .addNode(addNode3Request);
