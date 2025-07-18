import {
  AddEdgeRequest,
  AddNodeRequest,
  Canvas,
  CanvasBuilder,
} from "@html-graph/html-graph";
import { createInOutNode } from "../shared/create-in-out-node";

const canvasElement: HTMLElement = document.getElementById("canvas")!;
const builder: CanvasBuilder = new CanvasBuilder(canvasElement);
builder.enableResizeReactiveNodes();

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

const slider: HTMLInputElement = document.getElementById(
  "slider",
) as HTMLInputElement;

slider.addEventListener(
  "input",
  () => {
    addNode1Request.element.style.width = `${slider.value}px`;
    addNode1Request.element.style.height = `${slider.value}px`;
    addNode2Request.element.style.width = `${slider.value}px`;
    addNode2Request.element.style.height = `${slider.value}px`;
  },
  { passive: true },
);
