import {
  AddEdgeRequest,
  AddNodeRequest,
  BezierEdgeShape,
  Canvas,
  CanvasBuilder,
  CanvasDefaults,
  DraggableNodesConfig,
  InteractiveEdgeShape,
} from "@html-graph/html-graph";
import { createInOutNode } from "../shared/create-in-out-node";

const canvasElement: HTMLElement = document.getElementById("canvas")!;
const builder: CanvasBuilder = new CanvasBuilder(canvasElement);

const canvasDefaults: CanvasDefaults = {
  nodes: {
    priority: 1,
  },
  edges: {
    priority: 0,
    shape: (edgeId) => {
      const baseShape = new BezierEdgeShape({
        hasTargetArrow: true,
      });

      const interactiveEdge = new InteractiveEdgeShape(baseShape, {
        width: 10,
      });

      const handler = (): void => {
        document.getElementById("result")!.innerText =
          `clicked on edge with id: ${edgeId}`;
      };

      interactiveEdge.handle.addEventListener("mousedown", (event) => {
        event.stopPropagation();
        handler();
      });

      interactiveEdge.handle.addEventListener("touchstart", (event) => {
        event.stopPropagation();
        handler();
      });

      return interactiveEdge;
    },
  },
};

const dragConfig: DraggableNodesConfig = {
  moveOnTop: false,
};

const canvas: Canvas = builder
  .setDefaults(canvasDefaults)
  .enableUserDraggableNodes(dragConfig)
  .enableUserTransformableViewport()
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

const addNode3Request: AddNodeRequest = createInOutNode({
  name: "Node 3",
  x: 800,
  y: 300,
  frontPortId: "node-3-in",
  backPortId: "node-3-out",
});

const addEdge1Request: AddEdgeRequest = {
  from: "node-1-out",
  to: "node-2-in",
};

const addEdge2Request: AddEdgeRequest = {
  from: "node-2-out",
  to: "node-3-in",
};

canvas
  .addNode(addNode1Request)
  .addNode(addNode2Request)
  .addNode(addNode3Request)
  .addEdge(addEdge1Request)
  .addEdge(addEdge2Request);
