import {
  AddEdgeRequest,
  AddNodeRequest,
  Canvas,
  CanvasBuilder,
  ViewportTransformConfig,
} from "@html-graph/html-graph";
import { createInOutNode } from "../shared/create-in-out-node";

let isSpacePressed = false;

document.addEventListener(
  "keydown",
  (event: KeyboardEvent) => {
    if (event.code === "Space") {
      isSpacePressed = true;
    }
  },
  { passive: true },
);

document.addEventListener(
  "keyup",
  (event: KeyboardEvent) => {
    if (event.code === "Space") {
      isSpacePressed = false;
    }
  },
  { passive: true },
);

const canvasElement: HTMLElement = document.getElementById("canvas")!;
const builder: CanvasBuilder = new CanvasBuilder(canvasElement);

const transformOptions: ViewportTransformConfig = {
  shift: {
    mouseDownEventVerifier: (event: MouseEvent) =>
      event.button === 0 && isSpacePressed,
  },
};

const canvas: Canvas = builder
  .enableUserTransformableViewport(transformOptions)
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
