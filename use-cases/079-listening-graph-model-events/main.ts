import {
  AddEdgeRequest,
  AddNodeRequest,
  Canvas,
  CanvasBuilder,
} from "@html-graph/html-graph";
import { createInOutNode } from "../shared/create-in-out-node";

const log: string[] = [];

const updateLog = (msg: string): void => {
  log.push(msg);
  console.log(log);
};

const builder: CanvasBuilder = new CanvasBuilder();
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

canvas.graph.onAfterNodeAdded.subscribe((nodeId) => {
  updateLog(`Node added ${nodeId}`);
});

canvas.graph.onAfterNodeCoordinatesUpdated.subscribe((nodeId) => {
  updateLog(`Node coordinates updated ${nodeId}`);
});

canvas.graph.onAfterNodePriorityUpdated.subscribe((nodeId) => {
  updateLog(`Node priority updated ${nodeId}`);
});

canvas.graph.onBeforeNodeRemoved.subscribe((nodeId) => {
  updateLog(`Node removed ${nodeId}`);
});

canvas.graph.onAfterPortAdded.subscribe((portId) => {
  updateLog(`Port added ${portId}`);
});

canvas
  .attach(canvasElement)
  .addNode(addNode1Request)
  .addNode(addNode2Request)
  .addEdge(addEdgeRequest)
  .updateNode("node-1", { x: 100, y: 150, priority: 10 })
  .removeNode("node-1");
