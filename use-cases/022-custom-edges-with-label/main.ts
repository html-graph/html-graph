import {
  AddEdgeRequest,
  AddNodeRequest,
  Canvas,
  CanvasBuilder,
} from "@html-graph/html-graph";
import { createInOutNode } from "../shared/create-in-out-node";
import { EdgeWithLabelShape } from "./edge-with-label-shape";

const builder: CanvasBuilder = new CanvasBuilder();
builder.enableUserDraggableNodes().enableUserTransformableViewport();
const canvasElement: HTMLElement = document.getElementById("canvas")!;
const canvas: Canvas = builder.setElement(canvasElement).build();

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

const shape = new EdgeWithLabelShape("Connection 1");

const addEdgeRequest: AddEdgeRequest = {
  from: "node-1-out",
  to: "node-2-in",
  shape,
};

canvas
  .addNode(addNode1Request)
  .addNode(addNode2Request)
  .addEdge(addEdgeRequest);
