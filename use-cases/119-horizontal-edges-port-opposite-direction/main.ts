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
};

const canvas: Canvas = builder
  .setDefaults(canvasDefaults)
  .enableUserTransformableViewport()
  .enableUserDraggableNodes()
  .enableBackground()
  .build();

const addNode1Request: AddNodeRequest = createInOutNode({
  name: "Node 1",
  x: 200,
  y: 200,
  frontPort: { id: "node-1-front", direction: 0 },
  backPort: { id: "node-1-back", direction: 0 },
});

const addNode2Request: AddNodeRequest = createInOutNode({
  name: "Node 2",
  x: 400,
  y: 400,
  frontPort: { id: "node-2-front", direction: 0 },
  backPort: { id: "node-2-back", direction: -Math.PI },
});

const addEdge1Request: AddEdgeRequest = {
  from: "node-1-back",
  to: "node-2-back",
};

const addNode3Request: AddNodeRequest = createInOutNode({
  name: "Node 3",
  x: 700,
  y: 200,
  frontPort: { id: "node-3-front", direction: -Math.PI },
  backPort: { id: "node-3-back", direction: 0 },
});

const addNode4Request: AddNodeRequest = createInOutNode({
  name: "Node 4",
  x: 900,
  y: 400,
  frontPort: { id: "node-4-front", direction: 0 },
  backPort: { id: "node-4-back", direction: 0 },
});

const addEdge2Request: AddEdgeRequest = {
  from: "node-3-front",
  to: "node-4-front",
};

canvas
  .addNode(addNode1Request)
  .addNode(addNode2Request)
  .addEdge(addEdge1Request)
  .addNode(addNode3Request)
  .addNode(addNode4Request)
  .addEdge(addEdge2Request);
