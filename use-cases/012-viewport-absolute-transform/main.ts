import {
  AddEdgeRequest,
  AddNodeRequest,
  Canvas,
  CanvasBuilder,
  PatchMatrixRequest,
  TransformOptions,
} from "@html-graph/html-graph";
import { createInOutNode } from "../shared/create-in-out-node";

const canvasElement: HTMLElement = document.getElementById("canvas")!;
const boundsElement = document.getElementById("bounds")! as HTMLElement;

new ResizeObserver(() => {
  const { width, height } = canvasElement.getBoundingClientRect();

  boundsElement.style.visibility = "visible";
  boundsElement.style.width = `${width - 10}px`;
  boundsElement.style.height = `${height - 10}px`;
}).observe(canvasElement);

const sliderScale: HTMLInputElement = document.getElementById(
  "scale",
) as HTMLInputElement;

const scaleValue: HTMLElement = document.getElementById("scale-value")!;

const sliderX: HTMLInputElement = document.getElementById(
  "x",
) as HTMLInputElement;

const xValue: HTMLElement = document.getElementById("x-value")!;

const sliderY: HTMLInputElement = document.getElementById(
  "y",
) as HTMLInputElement;

const yValue: HTMLElement = document.getElementById("y-value")!;

const builder: CanvasBuilder = new CanvasBuilder();
const boundsContainerElement = document.getElementById(
  "bounds-container",
)! as HTMLElement;

const updateRectangleTransform = (): void => {
  const viewportMatrix = canvas.viewport.getViewportMatrix();
  scaleValue.innerText = `${viewportMatrix.scale.toFixed(2)}`;
  xValue.innerText = `${viewportMatrix.x.toFixed(2)}`;
  yValue.innerText = `${viewportMatrix.y.toFixed(2)}`;

  const { scale, x, y } = canvas.viewport.getContentMatrix();
  boundsContainerElement.style.transform = `matrix(${scale}, 0, 0, ${scale}, ${x}, ${y})`;
};

const transformOptions: TransformOptions = {
  events: {
    onTransformChange: () => {
      updateRectangleTransform();
    },
  },
};

builder.setUserTransformableViewport(transformOptions);

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
  .attach(canvasElement)
  .addNode(addNode1Request)
  .addNode(addNode2Request)
  .addEdge(addEdgeRequest);

sliderScale.addEventListener("input", () => {
  const patchRequest: PatchMatrixRequest = {
    scale: parseFloat(sliderScale.value),
  };

  canvas.patchViewportMatrix(patchRequest);
  scaleValue.innerText = sliderScale.value;
  updateRectangleTransform();
});

sliderX.addEventListener("input", () => {
  const patchRequest: PatchMatrixRequest = {
    x: parseFloat(sliderX.value),
  };

  canvas.patchViewportMatrix(patchRequest);
  xValue.innerText = sliderX.value;
  updateRectangleTransform();
});

sliderY.addEventListener("input", () => {
  const patchRequest: PatchMatrixRequest = {
    y: parseFloat(sliderY.value),
  };

  canvas.patchViewportMatrix(patchRequest);
  yValue.innerText = sliderY.value;
  updateRectangleTransform();
});
