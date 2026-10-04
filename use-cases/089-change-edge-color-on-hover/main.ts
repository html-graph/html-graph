import {
  AddEdgeRequest,
  AddNodeRequest,
  BezierEdgeShape,
  Canvas,
  CanvasBuilder,
  CanvasDefaults,
} from "@html-graph/html-graph";
import { createInOutNode } from "../shared/create-in-out-node";

const canvasElement: HTMLElement = document.getElementById("canvas")!;
const builder: CanvasBuilder = new CanvasBuilder(canvasElement);

const edgeColor = "#777777";
const hoverEdgeColor = "#f9880e";

const defaults: CanvasDefaults = {
  nodes: {
    priority: 1,
  },
  edges: {
    shape: () => {
      const shape = new BezierEdgeShape({
        hasTargetArrow: true,
        color: edgeColor,
        interactiveDistance: 40,
      });

      shape.element.addEventListener("mouseenter", () => {
        shape.element.style.setProperty("--edge-color", hoverEdgeColor);
      });

      shape.element.addEventListener("mouseleave", () => {
        shape.element.style.setProperty("--edge-color", edgeColor);
      });

      return shape;
    },
    priority: 0,
  },
};

const canvas: Canvas = builder
  .setDefaults(defaults)
  .enableUserTransformableViewport()
  .enableUserDraggableNodes({ moveEdgesOnTop: false })
  .enableBackground()
  .build();

const addNode1Request: AddNodeRequest = createInOutNode({
  name: "Node 1",
  x: 200,
  y: 400,
  frontPort: { id: "node-1-in" },
  backPort: { id: "node-1-out" },
});

const addNode2Request: AddNodeRequest = createInOutNode({
  name: "Node 2",
  x: 500,
  y: 500,
  frontPort: { id: "node-2-in" },
  backPort: { id: "node-2-out" },
});

const addEdgeRequest: AddEdgeRequest = {
  from: "node-1-out",
  to: "node-2-in",
};

canvas
  .addNode(addNode1Request)
  .addNode(addNode2Request)
  .addEdge(addEdgeRequest);
