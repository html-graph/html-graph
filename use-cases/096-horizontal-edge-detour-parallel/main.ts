import {
  AddEdgeRequest,
  AddNodeRequest,
  Canvas,
  CanvasBuilder,
} from "@html-graph/html-graph";
import { createInOutNode } from "../shared/create-in-out-node";

const canvasElement: HTMLElement = document.getElementById("canvas")!;
const builder: CanvasBuilder = new CanvasBuilder(canvasElement);
const canvas: Canvas = builder
  .setDefaults({
    edges: {
      shape: {
        type: "horizontal",
        hasTargetArrow: true,
      },
    },
  })
  .enableUserDraggableNodes()
  .enableUserTransformableViewport()
  .enableBackground()
  .build();

const addNodeRequest: AddNodeRequest = createInOutNode({
  name: "Node 1",
  x: 500,
  y: 500,
  frontPortId: "node-1-in",
  backPortId: "node-1-out",
});

const addEdgeRequest: AddEdgeRequest = {
  from: "node-1-out",
  to: "node-1-in",
};

canvas.addNode(addNodeRequest).addEdge(addEdgeRequest);
