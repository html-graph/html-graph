import {
  AddEdgeRequest,
  AddNodeRequest,
  Canvas,
  CanvasBuilder,
  DraggableNodesConfig,
  NodeDragPayload,
} from "@html-graph/html-graph";
import { createInOutNode } from "../shared/create-in-out-node";

const canvasElement: HTMLElement = document.getElementById("canvas")!;
const builder: CanvasBuilder = new CanvasBuilder(canvasElement);

const current = document.getElementById("current") as HTMLElement;

const dragConfig: DraggableNodesConfig = {
  events: {
    onBeforeNodeDrag: (payload: NodeDragPayload) => {
      current.innerText = `before drag triggered for ${JSON.stringify(payload)}`;

      return true;
    },
    onNodeDrag: (payload: NodeDragPayload) => {
      current.innerText = `drag triggered for ${JSON.stringify(payload)}`;
    },
    onNodeDragFinished: (payload: NodeDragPayload) => {
      current.innerText = `drag finished triggered for ${JSON.stringify(payload)}`;
    },
  },
};

const canvas: Canvas = builder.enableUserDraggableNodes(dragConfig).build();

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
