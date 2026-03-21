import {
  AddEdgeRequest,
  AddNodeRequest,
  Canvas,
  CanvasDefaults,
  CanvasBuilder,
  HorizontalEdgeShape,
  MidpointEdgeShape,
} from "@html-graph/html-graph";
import { createInOutNode } from "../shared/create-in-out-node";
import { createMidpoint } from "../shared/create-midpoint";

const canvasElement: HTMLElement = document.getElementById("canvas")!;
const builder: CanvasBuilder = new CanvasBuilder(canvasElement);

const canvasDefaults: CanvasDefaults = {
  edges: {
    shape: () => {
      const baseShape = new HorizontalEdgeShape({
        hasTargetArrow: true,
      });

      const midpoint = createMidpoint();
      const midpointShape = new MidpointEdgeShape(baseShape, midpoint);

      return midpointShape;
    },
  },
  ports: {
    direction: -Math.PI,
  },
};

const canvas: Canvas = builder
  .setDefaults(canvasDefaults)
  .enableUserTransformableViewport()
  .enableUserDraggableNodes()
  .enableBackground()
  .build();

const addNode1Request: AddNodeRequest = createInOutNode({
  name: "Node 1",
  x: 500,
  y: 400,
  frontPort: { id: "node-1-front" },
  backPort: { id: "node-1-back" },
});

const addNode2Request: AddNodeRequest = createInOutNode({
  name: "Node 2",
  x: 200,
  y: 500,
  frontPort: { id: "node-2-front" },
  backPort: { id: "node-2-back" },
});

const addNode3Request: AddNodeRequest = createInOutNode({
  name: "Node 3",
  x: 500,
  y: 650,
  frontPort: { id: "node-3-front" },
  backPort: { id: "node-3-back" },
});

const addEdge1Request: AddEdgeRequest = {
  from: "node-1-front",
  to: "node-2-back",
};

const addEdge2Request: AddEdgeRequest = {
  from: "node-2-front",
  to: "node-3-back",
};

canvas
  .addNode(addNode1Request)
  .addNode(addNode2Request)
  .addNode(addNode3Request)
  .addEdge(addEdge1Request)
  .addEdge(addEdge2Request);
