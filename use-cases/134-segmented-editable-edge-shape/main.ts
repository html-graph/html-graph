import {
  AddEdgeRequest,
  AddNodeRequest,
  Canvas,
  CanvasBuilder,
  SegmentedEditableEdgeShape,
} from "@html-graph/html-graph";
import { createInOutNode } from "../shared/create-in-out-node";
import { createMidpoint } from "../shared/create-midpoint";

const canvasElement: HTMLElement = document.getElementById("canvas")!;
const canvas: Canvas = new CanvasBuilder(canvasElement)
  .enableUserTransformableViewport()
  .enableUserDraggableNodes()
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

const midpointElement = createMidpoint();

const edgeShape = new SegmentedEditableEdgeShape(canvas.viewport, {
  hasTargetArrow: true,
  midpointElement,
});

edgeShape.waypoints.setValue([{ x: 300, y: 300 }]);

edgeShape.waypoints.onChange.subscribe(() => {
  const waypoints = edgeShape.waypoints.getValue();

  console.log(waypoints);
});

const addEdgeRequest: AddEdgeRequest = {
  from: "node-1-out",
  to: "node-2-in",
  shape: edgeShape,
};

canvas
  .addNode(addNode1Request)
  .addNode(addNode2Request)
  .addEdge(addEdgeRequest)
  .focus();
