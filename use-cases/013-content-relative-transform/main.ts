import {
  AddEdgeRequest,
  AddNodeRequest,
  Canvas,
  HtmlGraphBuilder,
  PatchMatrixRequest,
} from "@html-graph/html-graph";
import { createInOutNode } from "../shared/create-in-out-node";

const builder: HtmlGraphBuilder = new HtmlGraphBuilder();
const canvas: Canvas = builder.build();
const canvasElement: HTMLElement = document.getElementById("canvas")!;

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
  .attach(canvasElement)
  .addNode(addNode1Request)
  .addNode(addNode2Request)
  .addEdge(addEdgeRequest);

const sliderScale: HTMLInputElement = document.getElementById(
  "scale",
) as HTMLInputElement;

const scaleValue: HTMLElement = document.getElementById(
  "scale-value",
) as HTMLElement;

sliderScale.addEventListener("input", () => {
  const patchRequest: PatchMatrixRequest = {
    scale: parseFloat(sliderScale.value),
  };

  canvas.patchContentMatrix(patchRequest);
  scaleValue.innerText = sliderScale.value;
});

const sliderDeltaX: HTMLInputElement = document.getElementById(
  "delta-x",
) as HTMLInputElement;

const deltaXValue: HTMLElement = document.getElementById(
  "delta-x-value",
) as HTMLElement;

sliderDeltaX.addEventListener("input", () => {
  const patchRequest: PatchMatrixRequest = {
    x: parseFloat(sliderDeltaX.value),
  };

  canvas.patchContentMatrix(patchRequest);
  deltaXValue.innerText = sliderDeltaX.value;
});

const sliderDeltaY: HTMLInputElement = document.getElementById(
  "delta-y",
) as HTMLInputElement;
const deltaYValue: HTMLElement = document.getElementById(
  "delta-y-value",
) as HTMLElement;

sliderDeltaY.addEventListener("input", () => {
  const patchRequest: PatchMatrixRequest = {
    y: parseFloat(sliderDeltaY.value),
  };

  canvas.patchContentMatrix(patchRequest);
  deltaYValue.innerText = sliderDeltaY.value;
});
