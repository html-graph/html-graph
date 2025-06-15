import {
  AddEdgeRequest,
  AddNodeRequest,
  BackgroundConfig,
  Canvas,
  CanvasBuilder,
} from "@html-graph/html-graph";
import { createInOutNode } from "../shared/create-in-out-node";

const canvasElement: HTMLElement = document.getElementById("canvas")!;
const builder: CanvasBuilder = new CanvasBuilder(canvasElement);

const backgroundRenderer = document.createElementNS(
  "http://www.w3.org/2000/svg",
  "path",
);

backgroundRenderer.setAttribute("d", "M -25 0 L 25 0 M 0 25 L 0 -25");
backgroundRenderer.setAttribute("stroke-width", "1");
backgroundRenderer.setAttribute("stroke", "#CCCCFF");

const backgroundConfig: BackgroundConfig = {
  tileDimensions: {
    width: 50,
    height: 50,
  },
  renderer: backgroundRenderer,
  maxViewportScale: 30,
};

const canvas: Canvas = builder
  .enableUserDraggableNodes()
  .enableUserTransformableViewport()
  .enableBackground(backgroundConfig)
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
