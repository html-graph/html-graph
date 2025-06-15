import {
  AddEdgeRequest,
  AddNodeRequest,
  Canvas,
  CanvasBuilder,
  ViewportTransformConfig,
} from "@html-graph/html-graph";
import { createInOutNode } from "../shared/create-in-out-node";

const canvasElement: HTMLElement = document.getElementById("canvas")!;
const builder: CanvasBuilder = new CanvasBuilder(canvasElement);

const updateTransform = (): void => {
  const viewportTransform = canvas.viewport.getViewportMatrix();
  const contentTransform = canvas.viewport.getContentMatrix();

  const currentViewport = document.getElementById(
    "current-viewport",
  ) as HTMLElement;
  currentViewport.innerText = JSON.stringify(viewportTransform);

  const currentContent = document.getElementById(
    "current-content",
  ) as HTMLElement;
  currentContent.innerText = JSON.stringify(contentTransform);
};

const transformOptions: ViewportTransformConfig = {
  events: {
    onTransformChange: () => {
      updateTransform();
    },
  },
};

const canvas: Canvas = builder
  .enableUserTransformableViewport(transformOptions)
  .build();

updateTransform();

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
