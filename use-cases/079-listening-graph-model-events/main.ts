import {
  AddEdgeRequest,
  AddNodeRequest,
  Canvas,
  CanvasBuilder,
  HorizontalEdgeShape,
} from "@html-graph/html-graph";
import { createInOutNode } from "../shared/create-in-out-node";

const log: string[] = [];
const logElement = document.getElementById("log")!;

const updateLog = (msg: string): void => {
  log.push(msg);
  logElement.innerText = log.join("\n");
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
  id: "edge-1",
  from: "node-1-out",
  to: "node-2-in",
};

canvas.graph.onAfterNodeAdded.subscribe((nodeId) => {
  updateLog(`Node added ${nodeId}`);
});

canvas.graph.onAfterNodeUpdated.subscribe((nodeId) => {
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

canvas.graph.onAfterPortUpdated.subscribe((portId) => {
  updateLog(`Port direction updated ${portId}`);
});

canvas.graph.onBeforePortRemoved.subscribe((portId) => {
  updateLog(`Port removed ${portId}`);
});

canvas.graph.onAfterEdgeAdded.subscribe((edgeId) => {
  updateLog(`Edge added ${edgeId}`);
});

canvas.graph.onAfterEdgeShapeUpdated.subscribe((edgeId) => {
  updateLog(`Edge shape updated ${edgeId}`);
});

canvas.graph.onAfterEdgeUpdated.subscribe((edgeId) => {
  updateLog(`Edge adjacent ports updated ${edgeId}`);
});

canvas.graph.onAfterEdgePriorityUpdated.subscribe((edgeId) => {
  updateLog(`Edge priority updated ${edgeId}`);
});

canvas.graph.onBeforeEdgeRemoved.subscribe((edgeId) => {
  updateLog(`Edge removed ${edgeId}`);
});

canvas.graph.onBeforeClear.subscribe(() => {
  updateLog(`Canvas cleared`);
});

canvas
  .attach(canvasElement)
  .addNode(addNode1Request)
  .addNode(addNode2Request)
  .addEdge(addEdgeRequest)
  .updateEdge("edge-1", {
    from: "node-2-in",
    to: "node-1-out",
    shape: new HorizontalEdgeShape(),
    priority: 10,
  })
  .updateNode("node-1", { x: 100, y: 150, priority: 10 })
  .updatePort("node-1-out", { direction: Math.PI })
  .removeNode("node-1")
  .clear();
