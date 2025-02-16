import {
  AddEdgeRequest,
  AddNodeRequest,
  Canvas,
  CoreOptions,
  HtmlGraphBuilder,
} from "@html-graph/html-graph";
import { createInOutNode } from "../shared/create-in-out-node";

const builder: HtmlGraphBuilder = new HtmlGraphBuilder();

const coreOptions: CoreOptions = {
  edges: {
    shape: {
      hasTargetArrow: true,
    },
  },
};

builder.setOptions(coreOptions);

builder.setUserDraggableNodes();

const canvas: Canvas = builder.build();
const canvasElement: HTMLElement = document.getElementById("canvas")!;

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
  .attach(canvasElement)
  .addNode(addNode1Request)
  .addNode(addNode2Request)
  .addNode(addNode3Request)
  .addEdge(addEdgeRequest);

const btn = document.getElementById("update-source")!;

btn.addEventListener("click", () => {
  canvas.updateEdge("con-1", { from: "node-3-out" });
});
