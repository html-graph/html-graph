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
  nodes: {
    priority: "incremental",
  },
  edges: {
    shape: {
      hasTargetArrow: true,
    },
    priority: 0,
  },
};

builder.setDefaults(canvasDefaults);

const canvasElement: HTMLElement = document.getElementById("canvas")!;
const canvas: Canvas = builder.setElement(canvasElement).build();

const addNode1Request: AddNodeRequest = createInOutNode({
  name: "Node 1",
  x: 200,
  y: 300,
  frontPortId: "node-1-in",
  backPortId: "node-1-out",
});

const addNode2Request: AddNodeRequest = createInOutNode({
  name: "Node 2",
  x: 300,
  y: 400,
  frontPortId: "node-2-in",
  backPortId: "node-2-out",
});

const addNode3Request: AddNodeRequest = createInOutNode({
  name: "Node 3",
  x: 400,
  y: 500,
  frontPortId: "node-3-in",
  backPortId: "node-3-out",
});

const addNode4Request: AddNodeRequest = createInOutNode({
  name: "Node 4",
  x: 500,
  y: 600,
  frontPortId: "node-4-in",
  backPortId: "node-4-out",
});

const addEdge1Request: AddEdgeRequest = {
  from: "node-1-out",
  to: "node-2-in",
};

const addEdge2Request: AddEdgeRequest = {
  from: "node-2-out",
  to: "node-3-in",
};

const addEdge3Request: AddEdgeRequest = {
  from: "node-3-out",
  to: "node-4-in",
};

canvas
  .addNode(addNode1Request)
  .addNode(addNode2Request)
  .addNode(addNode3Request)
  .addNode(addNode4Request)
  .addEdge(addEdge1Request)
  .addEdge(addEdge2Request)
  .addEdge(addEdge3Request);
