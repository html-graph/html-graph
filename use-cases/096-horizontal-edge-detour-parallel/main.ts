import {
  AddEdgeRequest,
  AddNodeRequest,
  Canvas,
  CanvasBuilder,
  HorizontalEdgeShape,
} from "@html-graph/html-graph";
import { createInOutNode } from "../shared/create-in-out-node";

const canvasElement: HTMLElement = document.getElementById("canvas")!;
const builder: CanvasBuilder = new CanvasBuilder(canvasElement);
const canvas: Canvas = builder
  .setDefaults({
    edges: {
      shape: {
        type: "horizontal",
        hasTargetArrow: true,
        detourDistance: 100,
      },
    },
  })
  .enableUserTransformableViewport()
  .enableBackground()
  .build();

const addNode1Request: AddNodeRequest = createInOutNode({
  name: "Node 1",
  x: 500,
  y: 300,
  frontPortId: "node-1-in",
  backPortId: "node-1-out",
});

addNode1Request.element.classList.add("forward");

const addEdge1Request: AddEdgeRequest = {
  from: "node-1-out",
  to: "node-1-in",
};

const addNode2Request: AddNodeRequest = createInOutNode({
  name: "Node 2",
  x: 800,
  y: 300,
  frontPortId: "node-2-in",
  backPortId: "node-2-out",
});

addNode2Request.element.classList.add("backward");

const addEdge2Request: AddEdgeRequest = {
  from: "node-2-out",
  to: "node-2-in",
};

const addNode3Request: AddNodeRequest = createInOutNode({
  name: "Node 3",
  x: 500,
  y: 600,
  frontPortId: "node-3-in",
  backPortId: "node-3-out",
});

addNode3Request.element.classList.add("forward");

const addEdge3Request: AddEdgeRequest = {
  from: "node-3-out",
  to: "node-3-in",
  shape: new HorizontalEdgeShape({
    hasTargetArrow: true,
    detourDistance: -100,
  }),
};

const addNode4Request: AddNodeRequest = createInOutNode({
  name: "Node 4",
  x: 800,
  y: 600,
  frontPortId: "node-4-in",
  backPortId: "node-4-out",
});

addNode4Request.element.classList.add("backward");

const addEdge4Request: AddEdgeRequest = {
  from: "node-4-out",
  to: "node-4-in",
  shape: new HorizontalEdgeShape({
    hasTargetArrow: true,
    detourDistance: -100,
  }),
};

canvas
  .addNode(addNode1Request)
  .addEdge(addEdge1Request)
  .addNode(addNode2Request)
  .addEdge(addEdge2Request)
  .addNode(addNode3Request)
  .addEdge(addEdge3Request)
  .addNode(addNode4Request)
  .addEdge(addEdge4Request);
