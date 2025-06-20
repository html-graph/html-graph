import { CanvasBuilder, AddNodeRequest } from "@html-graph/html-graph";
import { createInOutNode } from "../shared/create-in-out-node";

const canvasElement = document.getElementById("canvas")!;

const canvas = new CanvasBuilder(canvasElement)
  .enableBackground()
  .enableUserTransformableViewport()
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
  x: 600,
  y: 500,
  frontPortId: "node-2-in",
  backPortId: "node-2-out",
});

const addNode3Request: AddNodeRequest = createInOutNode({
  name: "Node 3",
  x: 200,
  y: 700,
  frontPortId: "node-3-in",
  backPortId: "node-3-out",
});

const addNode4Request: AddNodeRequest = createInOutNode({
  name: "Node 4",
  x: 1000,
  y: 600,
  frontPortId: "node-4-in",
  backPortId: "node-4-out",
});

canvas
  .addNode(addNode1Request)
  .addNode(addNode2Request)
  .addNode(addNode3Request)
  .addNode(addNode4Request)
  .addEdge({ from: "node-1-out", to: "node-2-in" })
  .addEdge({ from: "node-3-out", to: "node-2-in" })
  .addEdge({ from: "node-2-out", to: "node-4-in" });
