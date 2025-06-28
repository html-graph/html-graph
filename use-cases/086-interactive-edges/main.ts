import {
  AddEdgeRequest,
  AddNodeRequest,
  BezierEdgeShape,
  Canvas,
  CanvasBuilder,
  CanvasDefaults,
  InteractiveEdgeConfigurator,
} from "@html-graph/html-graph";
import { createInOutNode } from "../shared/create-in-out-node";

const canvasElement: HTMLElement = document.getElementById("canvas")!;
const builder: CanvasBuilder = new CanvasBuilder(canvasElement);

const canvasDefaults: CanvasDefaults = {
  edges: {
    shape: (edgeId) => {
      const baseShape = new BezierEdgeShape({
        hasTargetArrow: true,
      });

      const interactiveEdge = configurator.configure(baseShape, {
        onInteractionStart: () => {
          console.log(`start ${edgeId}`);
        },
        onInteractionEnd: () => {
          console.log(`end ${edgeId}`);
        },
        width: 0,
      });

      return interactiveEdge;
    },
  },
};

const canvas: Canvas = builder
  .setDefaults(canvasDefaults)
  .enableUserDraggableNodes()
  .enableUserTransformableViewport()
  .enableBackground()
  .build();

const configurator = new InteractiveEdgeConfigurator(canvas);

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
