import {
  AddEdgeRequest,
  AddNodeRequest,
  Canvas,
  CanvasDefaults,
  CanvasBuilder,
  VerticalEdgeShape,
  MidpointEdgeShape,
} from "@html-graph/html-graph";
import { createInOutNode } from "../shared/create-in-out-node";
import { createMidpoint } from "../shared/create-midpoint";

const canvasElement: HTMLElement = document.getElementById("canvas")!;
const builder: CanvasBuilder = new CanvasBuilder(canvasElement);

const canvasDefaults: CanvasDefaults = {
  edges: {
    shape: () => {
      const baseShape = new VerticalEdgeShape({
        hasTargetArrow: true,
      });

      const midpoint = createMidpoint();
      const midpointShape = new MidpointEdgeShape(baseShape, midpoint);

      return midpointShape;
    },
  },
  ports: {
    direction: -Math.PI / 2,
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
  x: 300,
  y: 300,
  frontPort: { id: "node-1-top" },
  backPort: { id: "node-1-bottom" },
});

const addNode2Request: AddNodeRequest = createInOutNode({
  name: "Node 2",
  x: 500,
  y: 500,
  frontPort: { id: "node-2-top" },
  backPort: { id: "node-2-bottom" },
});

const addNode3Request: AddNodeRequest = createInOutNode({
  name: "Node 3",
  x: 700,
  y: 200,
  frontPort: { id: "node-3-top" },
  backPort: { id: "node-3-bottom" },
});

const addEdge1Request: AddEdgeRequest = {
  from: "node-1-top",
  to: "node-2-bottom",
};

const addEdge2Request: AddEdgeRequest = {
  from: "node-2-top",
  to: "node-3-bottom",
};

canvas
  .addNode(addNode1Request)
  .addNode(addNode2Request)
  .addNode(addNode3Request)
  .addEdge(addEdge1Request)
  .addEdge(addEdge2Request);
