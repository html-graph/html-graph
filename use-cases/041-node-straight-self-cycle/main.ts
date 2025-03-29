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
      type: "straight",
      hasTargetArrow: true,
    },
  },
};

builder.setDefaults(canvasDefaults);

const canvas: Canvas = builder.build();
const canvasElement: HTMLElement = document.getElementById("canvas")!;

const addNode1Request: AddNodeRequest = createInOutNode({
  name: "Node 1",
  x: 200,
  y: 400,
  frontPortId: "node-1-in",
  backPortId: "node-1-out",
});

const addEdge1Request: AddEdgeRequest = {
  from: "node-1-out",
  to: "node-1-in",
};

canvas.attach(canvasElement).addNode(addNode1Request).addEdge(addEdge1Request);
