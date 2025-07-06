import {
  AddEdgeRequest,
  AddNodeRequest,
  BezierEdgeShape,
  Canvas,
  CanvasBuilder,
  CanvasDefaults,
  InteractiveEdgeShape,
} from "@html-graph/html-graph";
import { createInOutNode } from "../shared/create-in-out-node";

const canvasElement: HTMLElement = document.getElementById("canvas")!;
const builder: CanvasBuilder = new CanvasBuilder(canvasElement);

const edgeColor = "#00aa00";
const hoverEdgeColor = "red";

const defaults: CanvasDefaults = {
  nodes: {
    priority: 1,
  },
  edges: {
    shape: () => {
      const baseShape = new BezierEdgeShape({
        hasTargetArrow: true,
        color: edgeColor,
      });

      const interactiveShape = new InteractiveEdgeShape(baseShape, {
        width: 40,
      });

      interactiveShape.handle.addEventListener("mouseenter", () => {
        interactiveShape.svg.style.setProperty("--edge-color", hoverEdgeColor);
      });

      interactiveShape.handle.addEventListener("mouseleave", () => {
        interactiveShape.svg.style.setProperty("--edge-color", edgeColor);
      });

      return interactiveShape;
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
