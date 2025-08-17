import {
  AddEdgeRequest,
  AddNodeRequest,
  Canvas,
  CanvasBuilder,
} from "@html-graph/html-graph";
import { createInOutNode } from "../shared/create-in-out-node";

import edges from "./graph.json";
import { TopologyGraph } from "./topology-graph";
import { SerializedEdge } from "./serialized-edge";

const graph = new TopologyGraph();

edges.forEach((edge: SerializedEdge) => {
  if (!graph.nodes.has(edge.from)) {
    graph.addNode(edge.from);
  }

  if (!graph.nodes.has(edge.to)) {
    graph.addNode(edge.to);
  }

  graph.addEdge(edge.id, edge.from, edge.to);
});

console.log(graph);

const canvasElement: HTMLElement = document.getElementById("canvas")!;
const builder: CanvasBuilder = new CanvasBuilder(canvasElement);
const canvas: Canvas = builder.build();

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
