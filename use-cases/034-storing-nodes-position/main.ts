import {
  AddEdgeRequest,
  AddNodeRequest,
  Canvas,
  DragOptions,
  CanvasBuilder,
  NodeDragPayload,
} from "@html-graph/html-graph";
import { createInOutNode } from "../shared/create-in-out-node";

const positions = new Map<unknown, { x: number; y: number }>();

const nodesElement: HTMLElement = document.getElementById("nodes")!;

const builder: CanvasBuilder = new CanvasBuilder();

const dragOptions: DragOptions = {
  events: {
    onNodeDrag: (payload: NodeDragPayload) => {
      positions.set(payload.nodeId, { x: payload.x, y: payload.y });
      nodesElement.innerText = JSON.stringify(Object.fromEntries(positions));
    },
  },
};

builder.enableUserDraggableNodes(dragOptions);

const canvas: Canvas = builder.build();
const canvasElement: HTMLElement = document.getElementById("canvas")!;

const addNode1Request: AddNodeRequest = createInOutNode({
  id: "node-1",
  name: "Node 1",
  x: 200,
  y: 400,
  frontPortId: "node-1-in",
  backPortId: "node-1-out",
});

const addNode2Request: AddNodeRequest = createInOutNode({
  id: "node-2",
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
  .attach(canvasElement)
  .addNode(addNode1Request)
  .addNode(addNode2Request)
  .addEdge(addEdgeRequest);

canvas.graph.getAllNodeIds().forEach((nodeId) => {
  const node = canvas.graph.getNode(nodeId)!;

  positions.set(nodeId, { x: node.x, y: node.y });
});

nodesElement.innerText = JSON.stringify(Object.fromEntries(positions));
