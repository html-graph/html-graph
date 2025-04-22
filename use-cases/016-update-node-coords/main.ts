import {
  AddEdgeRequest,
  AddNodeRequest,
  Canvas,
  CanvasBuilder,
} from "@html-graph/html-graph";
import { createInOutNode } from "../shared/create-in-out-node";

const builder: CanvasBuilder = new CanvasBuilder();
const canvasElement: HTMLElement = document.getElementById("canvas")!;
const canvas: Canvas = builder.setElement(canvasElement).build();

const addNode1Request: AddNodeRequest = createInOutNode({
  id: "node-1",
  name: "Node 1",
  x: 200,
  y: 400,
  frontPortId: "node-1-in",
  backPortId: "node-1-out",
});

const addNode2Request: AddNodeRequest = createInOutNode({
  id: "node-2",
  name: "Node 2",
  x: 500,
  y: 500,
  frontPortId: "node-2-in",
  backPortId: "node-2-out",
});

const addEdgeRequest: AddEdgeRequest = {
  from: "node-1-out",
  to: "node-2-in",
};

canvas
  .addNode(addNode1Request)
  .addNode(addNode2Request)
  .addEdge(addEdgeRequest);

const updateBtn: HTMLElement = document.getElementById("update-node-coords")!;

let i = 0;

updateBtn.addEventListener("click", () => {
  if (i % 2) {
    canvas.updateNode("node-2", { x: 500, y: 500 });
  } else {
    canvas.updateNode("node-2", { x: 700, y: 700 });
  }

  i++;
});
