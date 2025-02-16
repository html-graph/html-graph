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

const canvas: Canvas = builder.build();
const canvasElement: HTMLElement = document.getElementById("canvas")!;

const addNode1Request: AddNodeRequest = createInOutNode({
  id: "node-1",
  name: "Node 1",
  x: 200,
  y: 300,
  frontPortId: "node-1-in",
  backPortId: "node-1-out",
  priority: 0,
});

const addNode2Request: AddNodeRequest = createInOutNode({
  id: "node-2",
  name: "Node 2",
  x: 300,
  y: 400,
  frontPortId: "node-2-in",
  backPortId: "node-2-out",
  priority: 1,
});

const addEdge1Request: AddEdgeRequest = {
  from: "node-1-out",
  to: "node-2-in",
  priority: 2,
};

canvas
  .attach(canvasElement)
  .addNode(addNode1Request)
  .addNode(addNode2Request)
  .addEdge(addEdge1Request);

const priorityBtn: HTMLElement = document.getElementById("priority")!;

priorityBtn.addEventListener("click", () => {
  canvas.updateNode("node-1", { priority: 3 });
});
