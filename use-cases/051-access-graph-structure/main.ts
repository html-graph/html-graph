import {
  AddEdgeRequest,
  AddNodeRequest,
  Canvas,
  CanvasDefaults,
  CanvasBuilder,
  Identifier,
} from "@html-graph/html-graph";
import { createInOutNode } from "../shared/create-in-out-node";

const canvasElement: HTMLElement = document.getElementById("canvas")!;
const builder: CanvasBuilder = new CanvasBuilder(canvasElement);

const canvasDefaults: CanvasDefaults = {
  edges: {
    shape: {
      hasTargetArrow: true,
    },
  },
};

const canvas: Canvas = builder.setDefaults(canvasDefaults).build();

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
  y: 600,
  frontPortId: "node-3-in",
  backPortId: "node-3-out",
});

const addNode4Request: AddNodeRequest = createInOutNode({
  name: "Node 4",
  x: 800,
  y: 400,
  frontPortId: "node-4-in",
  backPortId: "node-4-out",
});

const addEdge1Request: AddEdgeRequest = {
  from: "node-1-out",
  to: "node-2-in",
};

const addEdge2Request: AddEdgeRequest = {
  from: "node-2-out",
  to: "node-3-in",
};

const addEdge3Request: AddEdgeRequest = {
  from: "node-2-out",
  to: "node-4-in",
};

canvas
  .addNode(addNode1Request)
  .addNode(addNode2Request)
  .addNode(addNode3Request)
  .addNode(addNode4Request)
  .addEdge(addEdge1Request)
  .addEdge(addEdge2Request)
  .addEdge(addEdge3Request);

const structure: {
  nodes: Array<{ nodeId: Identifier; x: number; y: number }>;
  ports: Array<{ portId: Identifier; direction: number }>;
  edges: Array<{ edgeId: Identifier; from: Identifier; to: Identifier }>;
} = {
  nodes: [],
  edges: [],
  ports: [],
};

canvas.graph.getAllNodeIds().forEach((nodeId) => {
  const node = canvas.graph.getNode(nodeId)!;
  structure.nodes.push({
    nodeId,
    x: node.x!,
    y: node.y!,
  });
});

canvas.graph.getAllPortIds().forEach((portId) => {
  const port = canvas.graph.getPort(portId)!;
  structure.ports.push({
    portId,
    direction: port.direction,
  });
});

canvas.graph.getAllEdgeIds().forEach((edgeId) => {
  const edge = canvas.graph.getEdge(edgeId)!;
  structure.edges.push({
    edgeId,
    from: edge.from,
    to: edge.to,
  });
});

const nodesElement: HTMLElement = document.getElementById("nodes")!;
const portsElement: HTMLElement = document.getElementById("ports")!;
const edgesElement: HTMLElement = document.getElementById("edges")!;

nodesElement.innerText = JSON.stringify(structure.nodes);
portsElement.innerText = JSON.stringify(structure.ports);
edgesElement.innerText = JSON.stringify(structure.edges);
