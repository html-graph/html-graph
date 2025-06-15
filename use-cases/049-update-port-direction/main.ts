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

builder.setDefaults(canvasDefaults);

const canvas: Canvas = builder.build();

const addNode1Request: AddNodeRequest = createInOutNode({
  id: "node-1",
  name: "Node 1",
  x: 200,
  y: 300,
  frontPortId: "node-1-in",
  backPortId: "node-1-out",
});

const addNode2Request: AddNodeRequest = createInOutNode({
  id: "node-2",
  name: "Node 2",
  x: 500,
  y: 400,
  frontPortId: "node-2-in",
  backPortId: "node-2-out",
});

const addEdge1Request: AddEdgeRequest = {
  id: "edge-1",
  from: "node-1-out",
  to: "node-2-in",
};

canvas
  .addNode(addNode1Request)
  .addNode(addNode2Request)
  .addEdge(addEdge1Request);

const slider: HTMLInputElement = document.getElementById(
  "direction",
) as HTMLInputElement;

slider.addEventListener("input", () => {
  canvas.updatePort("node-2-in", { direction: parseFloat(slider.value) });
});
