import {
  AddEdgeRequest,
  AddNodeRequest,
  Canvas,
  CanvasBuilder,
  CanvasDefaults,
} from "@html-graph/html-graph";
import { createInOutNode } from "../shared/create-in-out-node";

const canvasElement: HTMLElement = document.getElementById("canvas")!;
const builder: CanvasBuilder = new CanvasBuilder(canvasElement);

const defaults: CanvasDefaults = {
  edges: {
    shape: {
      hasTargetArrow: true,
    },
  },
};

builder.setDefaults(defaults);

const canvas: Canvas = builder.build();

const addNode1Request: AddNodeRequest = createInOutNode({
  name: "Node 1",
  x: 200,
  y: 400,
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

const addEdgeRequest: AddEdgeRequest = {
  from: "node-1-out",
  to: "node-2-in",
};

canvas
  .addNode(addNode1Request)
  .addNode(addNode2Request)
  .addEdge(addEdgeRequest);

const updateBtn: HTMLElement = document.getElementById(
  "update-port-coordinates",
)!;

let i = 0;

updateBtn.addEventListener(
  "click",
  () => {
    const element = addNode2Request.element.children[0] as HTMLElement;

    if (i % 2) {
      element.style.marginTop = "0";
      element.style.marginBottom = "auto";
    } else {
      element.style.marginBottom = "0";
      element.style.marginTop = "auto";
    }

    canvas.updatePort("node-2-in");
    i++;
  },
  { passive: true },
);
