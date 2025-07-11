import {
  AddEdgeRequest,
  AddNodeRequest,
  Canvas,
  CanvasDefaults,
  CanvasBuilder,
} from "@html-graph/html-graph";
import { createInOutNode } from "../shared/create-in-out-node";

const canvasElement: HTMLElement = document.getElementById("canvas")!;
const builder: CanvasBuilder = new CanvasBuilder(canvasElement);

const canvasDefaults: CanvasDefaults = {
  edges: {
    shape: {
      hasTargetArrow: true,
    },
  },
};

const canvas: Canvas = builder
  .setDefaults(canvasDefaults)
  .enableUserDraggableNodes()
  .build();

const addNode1Request: AddNodeRequest = createInOutNode({
  name: "Node 1",
  x: 200,
  y: 700,
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
  x: 200,
  y: 300,
  frontPortId: "node-3-in",
  backPortId: "node-3-out",
});

const addEdgeRequest: AddEdgeRequest = {
  id: "con-1",
  from: "node-1-out",
  to: "node-2-in",
};

canvas
  .addNode(addNode1Request)
  .addNode(addNode2Request)
  .addNode(addNode3Request)
  .addEdge(addEdgeRequest);

const btn = document.getElementById("update-source")!;

let i = 0;

btn.addEventListener(
  "click",
  () => {
    i++;

    if (i % 2) {
      canvas.updateEdge("con-1", { from: "node-3-out" });
    } else {
      canvas.updateEdge("con-1", { from: "node-1-out" });
    }
  },
  { passive: true },
);
