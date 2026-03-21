import {
  AddEdgeRequest,
  AddNodeRequest,
  Canvas,
  CanvasBuilder,
  EdgeShape,
  MidpointEdgeShape,
  VerticalEdgeShape,
} from "@html-graph/html-graph";
import { createInOutNode } from "../shared/create-in-out-node";
import { createMidpoint } from "../shared/create-midpoint";

const createEdgeShape = (detourDistance: number): EdgeShape => {
  const baseShape = new VerticalEdgeShape({
    hasTargetArrow: true,
    detourDistance,
  });

  const midpoint = createMidpoint();
  const midpointShape = new MidpointEdgeShape(baseShape, midpoint);

  return midpointShape;
};

const canvasElement: HTMLElement = document.getElementById("canvas")!;
const builder: CanvasBuilder = new CanvasBuilder(canvasElement);
const canvas: Canvas = builder
  .setDefaults({
    edges: {
      shape: () => createEdgeShape(100),
    },
    ports: {
      direction: Math.PI / 2,
    },
  })
  .enableUserTransformableViewport()
  .enableBackground()
  .build();

const addNode1Request: AddNodeRequest = createInOutNode({
  name: "Node 1",
  x: 500,
  y: 300,
  frontPort: { id: "node-1-in" },
  backPort: { id: "node-1-out" },
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
  frontPort: { id: "node-2-in" },
  backPort: { id: "node-2-out" },
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
  frontPort: { id: "node-3-in" },
  backPort: { id: "node-3-out" },
});

addNode3Request.element.classList.add("forward");

const addEdge3Request: AddEdgeRequest = {
  from: "node-3-out",
  to: "node-3-in",
  shape: createEdgeShape(-100),
};

const addNode4Request: AddNodeRequest = createInOutNode({
  name: "Node 4",
  x: 800,
  y: 600,
  frontPort: { id: "node-4-in" },
  backPort: { id: "node-4-out" },
});

addNode4Request.element.classList.add("backward");

const addEdge4Request: AddEdgeRequest = {
  from: "node-4-out",
  to: "node-4-in",
  shape: createEdgeShape(-100),
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
