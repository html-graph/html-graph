import {
  AddEdgeRequest,
  AddNodeRequest,
  Canvas,
  CanvasDefaults,
  CanvasBuilder,
} from "@html-graph/html-graph";
import { createInOutNode } from "../shared/create-in-out-node";

const builder: CanvasBuilder = new CanvasBuilder();

const canvasDefaults: CanvasDefaults = {
  edges: {
    shape: {
      hasTargetArrow: true,
    },
  },
};

builder.setDefaults(canvasDefaults);

const canvas: Canvas = builder.build();
const canvasElement: HTMLElement = document.getElementById("canvas")!;

const addNode1Request: AddNodeRequest = createInOutNode({
  id: "node-1",
  name: "Node 1",
  x: 200,
  y: 300,
  frontPortId: "node-1-in",
  backPortId: "node-1-out",
  priority: 1,
});

const addNode2Request: AddNodeRequest = createInOutNode({
  id: "node-2",
  name: "Node 2",
  x: 700,
  y: 500,
  frontPortId: "node-2-in",
  backPortId: "node-2-out",
  priority: 1,
});

const addNode3Request: AddNodeRequest = createInOutNode({
  id: "node-3",
  name: "Node 3",
  x: 450,
  y: 400,
  frontPortId: "node-3-in",
  backPortId: "node-3-out",
  priority: 1,
});

const addEdge1Request: AddEdgeRequest = {
  id: "edge-1",
  from: "node-1-out",
  to: "node-2-in",
  priority: 0,
};

canvas
  .attach(canvasElement)
  .addNode(addNode1Request)
  .addNode(addNode2Request)
  .addNode(addNode3Request)
  .addEdge(addEdge1Request);

const priorityBtn: HTMLElement = document.getElementById("priority")!;

priorityBtn.addEventListener("click", () => {
  canvas.updateEdge("edge-1", { priority: 2 });
});
